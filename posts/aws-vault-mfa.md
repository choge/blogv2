---
title: 'aws-vaultで複数アカウントの認証を通したい'
date: '2023-02-26'
tags: ['AWS', 'aws-vault', 'MFA']
---

前提
====

- 複数のAWSアカウントを利用している
- IAM UserでID集約用アカウントにログインし、そこから各アカウントのRoleをAssumeする形
- ID集約用のアカウントでの操作の際にMFAでの認証を求められる。より具体的には、ID集約用のユーザーには、MFAでの認証なしでのActionをDenyするPolicyがアタッチされている
- 特定の（同じ）コマンドを、複数のAWSアカウントに対して実行したいケースがある
- 現状使っているツールは以下の通り：
  - 対象アカウントの切り替えに [direnv](https://github.com/direnv/direnv)
  - MFAの認証に [aws-mfa](https://github.com/broamski/aws-mfa)

やりたいこと
==========

- [aws-vault](https://github.com/99designs/aws-vault) を使った認証を行うようにしたい
  - aws-mfaだと結局Credentialsがローカル( `~/.aws/credentials` )に保存されてしまう。一方 `aws-vault` はOSのキーチェーンなど暗号化された場所にCredentialsを保存してくれる
  - ツールとしての開発も `aws-mfa` よりも `aws-vault` の方が活発
- シェルスクリプトなどで、複数アカウントを切り替えながらAWS CLIを実行するケースがある（e.g. 同じCloudFormation Templateを複数アカウントにデプロイする）。この時に、アカウントごとにMFAを入力したくない

現状
====

`aws-mfa` を使うことで、一応上記のやりたいことは達成できている

### `~/.aws/credentials`

以下のCredentialsが保存されている

- `[default-longterm]` profile: ID集約用アカウントのIAM Userに紐づくAccess Key ID & Secret Access Key
- `[default]` profile: `aws-mfa` がSTSから一時的な認証情報を取得して追記してくれる

### `~/.aws/config`

以下のような感じになっている

```ini
[default]
region = ap-northeast-1
mfa_serial = arn:aws:iam::123456789012:mfa/<mfa_token_name>

[profile account-a]
region = ap-northeast-1
role_arn = arn:aws:iam::123456789013:role/<some_role_to_assume>
source_profile = default

...
```

この時、 `[profile account-a]` の方に `mfa_serial` を設定しても動くが、この場合 `account-a` をAssume RoleしようとするたびにMFAでの認証を求められる。
`default` （ID集約用）に切り替わる時にMFAで認証しておけば、そのセッションが有効な間は当該のIAM Userについている「MFAがないと全部禁止」のPolicyに引っかからずに済む。

調べた内容
=========

今 `aws-mfa` を使っているところを `aws-vault` に切り替えるにあたっての変化点は・・・

- `[default-longterm]` のような形でAccess Key ID\Secret Access Keyを持つ必要はなくなる（これらの情報はOSのキーチェーンなどに保存される）
- 一旦各Profileに `mfa_serial` を記載すれば、毎回MFAでの認証を求められるが一応動くことは動く
- `aws-vault` は `.aws/credentials` を直接書き換えるようなことはせず、 `aws-vault exec <profile_name>` で指定したProfileの一時的な認証情報を環境変数経由で見えるようにしてくれる（cf. [How it works](https://github.com/99designs/aws-vault#how-it-works) ）
  - EC2みたいなLocal Metadata Serverをたちあげるオプションも一応ある
- したがって、  `[default-with-mfa]` のような何らかのSession → `[profile account-a]` のような段階を踏む必要がありそう。もう少し厳密には、 [`GetSessionToken` API](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_credentials_temp_control-access_getsessiontoken.html) で取得した一時的な認証情報(MFAこみ)を持っている状態で、個別のProfileに切り替える必要がありそう。 
  - ただし、 `aws-vault exec default-with-mfa` で起動するサブシェルの中でAssume roleしても動かない（自前で環境変数を上書きしない限り）。サブシェル内では環境変数にAccess Key ID/Secret Access KeyがExportされているので、例えば `AWS_PROFILE=account-a aws sts get-caller-identity` のようにしても、すでに環境変数にあるaccess keyが使われる（環境変数より優先順位が高いのは [CLIのオプションだけ](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html#cli-configure-quickstart-precedence) ）
  - `aws-vaule exec --server default-with-mfa` は動かなさそう。 `aws-vault: error: exec: Can't use --prompt=terminal with --ec2-server. Specify a different prompt driver` って怒られる
  - かといって、 `aws-vault exec default-with-mfa -- aws sts get-caller-identity` とかで `aws-vault` に認証情報を覚えさせても、元のシェルで `AWS_PROFILE=account-a aws sts get-caller-identity` を打っても動かない。これは `aws-vault exec` の範囲外では当然 `default-with-mfa` の認証情報が見えないため

（というところまで調べて、継続調査中。。。config内の `credential_process` とかを使えばいける？？）

### GetSessionTokenの使い回し

> AWS Vault will attempt to re-use a GetSessionToken between profiles that share a common mfa_serial. 

とあるので、単純に複数のProfileの `mfa_serial` を設定すれば事足りるかも？ (cf. [MFA](https://github.com/99designs/aws-vault/blob/master/USAGE.md#mfa))


対象のソースは [この辺](https://github.com/99designs/aws-vault/blob/master/vault/sessiontokenprovider.go#L36-L60) だが、特にCacheを使っていそうな処理は見当たらない。

この辺で読み取ったConfigからMFAのSerial Numberを取得して。。。

```go
		input.SerialNumber = aws.String(p.GetMfaSerial())
		input.TokenCode, err = p.GetMfaToken()
```

[ここ](https://github.com/99designs/aws-vault/blob/a8cee667b96fe18e7cf86fa65b31a661ab112334/vault/mfa.go#L22-L29) で素直にMFA Tokenを取得している

```go
// GetMfaToken returns the MFA token
func (m *Mfa) GetMfaToken() (*string, error) {
	if m.mfaPromptFunc != nil {
		token, err := m.mfaPromptFunc(m.mfaSerial)
		return aws.String(token), err
	}

	return nil, errors.New("No prompt found")
}
```

何か勘違いしてるのだろうか・・・？
