---
title: 'AWS CloudFormation Roadmap'
date: '2023-05-05'
tags: [aws, cloudformation, iac]
---

[The history and future roadmap of the AWS CloudFormation Registry](https://aws.amazon.com/blogs/devops/cloudformation-coverage/) という記事を読んだ。意外とCloudFormationでも知らないことがたくさんあることに気づけて良かった

- CloudFormation Registryの歴史を振り返る
- 他のIaCツールとの統合の状況をチェック
- 現状のAWSリソースのカバー率と今後の見通し

# 歴史

- 2011年2月に導入
	- 当時は15サービスのうち13サービスをサポート、計48種類のリソースがあった
	- このタイミングではすべてCloudFormationチームが開発を行っていた
- 現時点ではAWSは200以上のサービスがある。2011年にリリースされた主要な機能は80個だったが、2021年では3,000個以上にのぼる
	- そのため、新しいサービスの開始時にCloudFromationでサポートされているように戦略を変更する必要があった
- 2016年に各サービスのチームが自分たちのリソースを管理できるSelf-service platformを作った
	- これで開発のスケーリングの問題が解消されただけでなく、より深いドメイン知識を持つサービスチームがIaCリソースを開発することで、IaCのコンポーネント構成もより効率的になった
	- ただし、同時に共通的な機能（ドリフト検知とか）を自動サポートするなどの、共通化・標準化も必要だということがわかってきた
- そのためレジストリを作ってまずは内部で使い始めた。自分たちで独自のリソースを定義したりできるようになった
	- ただ、レジストリを作るだけでは不十分で、布教したり、新サービスのリリース時の必須項目にしたりした

# Current State

* 標準化されたリソースモデルをもとに機能改善を行っている
	* 標準化されたリソースモデル＝↑で言っていた共通的な機能がサポートされた状態？
* [AWS Cloud Control API](https://aws.amazon.com/blogs/aws/announcing-aws-cloud-control-api/) というのを作った。これは様々なAWSリソースのCRUDL (Create-Read-Update-Delete-List) 操作のConsistentなAPI体験を提供してくれる
	* TerraformとかPulumiとかはこれを使っている
	* CloudFormationの [custom resources](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-custom-resources.html) もこれの恩恵を受けている。Third-party applicationのモデル化・プロビジョニングなどをサポートするもの。
		* 知らなかった・・・
		* CloudFormationでサポートされていないリソースをIaC管理したり
		* Template developer：当該のCustom Resource用のテンプレートを作る人。Service tokenというのを指定する必要があるらしい
		* Custom resource provider：↑で作られるCustom Resourceを実際に保有している
		* SNSの通知を受けてLambdaでモノを作ったりする模様
		* ただ、CloudFormation registryのExtensionで一部のユースケースはカバーできるらしい
	* CloudFormation Registry module。概ねTerraformのModuleみたいな、再利用できる形のなにかっぽい
	* [[Tech/CloudFormation Registry hooks]] もあるよ。デプロイするときにHookを実行して危険な操作を完全に止めたりいじったりできる
		* (Terraformのような) 完全にクライアント側で動くものにはこの機能はないよ
	* また、CloudFormation registryに定義を置いておくと、 [cdk-cloudformation](https://github.com/cdklabs/cdk-cloudformation) というので自動的にCDKでもさぽ0治されるようになる
	* 以下のようなコマンドで、定義されているリソースの詳細を知ることができる。 `ProvisioningType` が特に重要で、これが `IMMUTABLE` となっている場合は基本作り直しになる。
    ```sh
    aws cloudformation describe-type --type RESOURCE --type-name
    ```
# Opportunities for Improvement

- 究極のゴールは、すべてのリソースをカバーして、旧来のリソースモデルをなくすこと
	- VPC Endpointにタグがつけられるように ~~なっていたりする~~ →まだ対応されてなかった。 https://github.com/aws-cloudformation/cloudformation-coverage-roadmap/issues/196
- 最初に見積もったときより時間がかかっている。これは後方互換性を強く意識しているため。いつ書いたテンプレートだろうが、クライアントライブラリのバージョンを気にすることなくデプロイしていけるのがサーバーサイドでのIaCエンジンのよいところ
- Registry ExtensionsをJava以外で書くと大変だったりする、そのへんは認識している。
	- 現状はCLIとかPython, Go, TypeScriptあたりのサポートにチームが時間を使っている
-  [CloudFormation Coverage Roadmap](https://github.com/aws-cloudformation/cloudformation-coverage-roadmap/projects/1) というGitHub Projectにサポート状況が集約されている
- あと、 [community-registry-extensions](https://github.com/aws-cloudformation/community-registry-extensions) にCommunityが開発しているCloudFormationのExtensionが集まっている（名前空間の管理だけ？）

# その他

Guardians of Galaxy vol.3 めちゃくちゃよかった。思ったよりエモかった。

お気に入りはBlurp

![Blurp](https://static.wikia.nocookie.net/marvelcinematicuniverse/images/d/d5/Blurp.png/revision/latest?cb=20230217182908)
