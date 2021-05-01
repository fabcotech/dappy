module.exports.translations = {
  "menu deploy": {
    "one": "部署"
  },
  "menu dapps": {
    "one": "Dapps"
  },
  "menu settings": {
    "one": "设置"
  },
  "menu transactions": {
    "one": "交易信息"
  },
  "search dapps": {
    "one": "搜索dapp"
  },
  "ip application": {
    "one": "IP应用",
    "other": "IP应用"
  },
  "ip app": {
    "one": "IP应用",
    "other": "IP应用"
  },
  "dapp": {
    "one": "Dapp",
    "other": "Dapp"
  },
  "ip app security paragraph": {
    "one": "所有数据（例如您访问的页面，输入的密码）仅以加密方式传输到以下授权服务器："
  },
  "decentralized application": {
    "one": "分布式应用"
  },
  "dapp security paragraph": {
    "one": "该应用程序已直接从Dappy网络（区块链）加载。\n它已从以下端点加载："
  },
  "reload": {
    "one": "重载"
  },
  "menu accounts": {
    "one": "账户"
  },
  "menu networks": {
    "one": "网络"
  },
  "menu names": {
    "one": "名字"
  },
  "settings network paragraph": {
    "one": "Dappy从区块链加载资源时会执行多个请求。每当第三方Web应用程序的用户希望加载区块链资源（可以是文件或任何类型的数据）时， Dappy将查询区块链网络中的多个成员。\n\n您可以配置dappy接受或拒绝资源查询结果所应用的规则。\n\n<b>节点数：</ b> 在每个资源负载下将查询多少个节点，它必须小于或等于区块链的可用节点数。\n<b>准确性：</ b> 用于定义是否接受回复的规则。如果我们将其设置为100％，则如果任何节点的响应不同于其他节点，则将丢弃该响应和查询。如果将其设置为70％，则如果至少70％的查询节点已发送相同的响应，则该响应将被视为可信任/安全。"
  },
  "resolver": {
    "one": "解析器"
  },
  "auto": {
    "one": "自动"
  },
  "custom": {
    "one": "自定义"
  },
  "number of nodes": {
    "one": "节点数量"
  },
  "accuracy": {
    "one": "精确度"
  },
  "submit": {
    "one": "提交"
  },
  "development": {
    "one": "开发"
  },
  "settings development paragraph": {
    "one": "每次启动Web应用程序时都会转到开发模式并弹出开发工具。"
  },
  "development mode": {
    "one": "开发模式"
  },
  "settings accounts paragraph": {
    "one": "设置账户可以使您跟踪REV余额，并可避免每次发送交易时都输入私钥。您可以根据需要拥有任意数量的帐户。账户用密码对私钥进行了加密，您是唯一知晓者。当要求选择用于支付交易的账户时，将自动选择主账户。\n注意：目前在主网上大约需要10分钟才能完成具有多请求的块创建和余额更新。"
  },
  "set as main account": {
    "one": "设置主账户"
  },
  "send revs": {
    "one": "发送REV"
  },
  "remove account": {
    "one": "注销账户"
  },
  "transfer revs": {
    "one": "发送REV"
  },
  "transaction": {
    "one": "交易",
    "other": "交易"
  },
  "beta warning": {
    "one": "此版本是beta，即预发行版本。不要导入可以解锁大量金钱、代币或加密货币的私钥（ETH或REV）。\n\n该程序不与FABCO / DAPPY的任何专用服务器进行交互。它不依赖任何集中式服务或服务器。私钥存储在您的计算机上，并使用密码进行加密。尽管我们已经对代码进行了全面的测试，但它仍然是beta版，未经审计的软件，总有可能发生意外情况，从而导致您的资金损失。请注意，请不要投资超过您愿意承受的损失。\n\n请自行承担使用DAPPY、转移资金、导入私钥和公钥的风险。"
  },
  "for address": {
    "one": "接收方地址"
  },
  "password": {
    "one": "密码"
  },
  "phlogiston limit": {
    "one": "燃素限制"
  },
  "to (rev address)": {
    "one": "发送至（REV地址）"
  },
  "amount": {
    "one": "数量"
  },
  "from": {
    "one": "发送方地址"
  },
  "add acount": {
    "one": "新增账户"
  },
  "forgot password warning": {
    "one": "如果您忘记了密码，将无法恢复私钥。请确保选择一个强密码，并将私钥保存在其他位置。"
  },
  "name": {
    "one": "名字",
    "other": "名字"
  },
  "public key": {
    "one": "公钥"
  },
  "public key derived": {
    "one": "用私钥导出公钥"
  },
  "address": {
    "one": "地址"
  },
  "address derived": {
    "one": "导出地址"
  },
  "private key": {
    "one": "私钥"
  },
  "generate private key": {
    "one": "生成私钥"
  },
  "rchain network": {
    "one": "RChain网络"
  },
  "name price": {
    "one": "域名价格"
  },
  "last known block height": {
    "one": "最近已知区块高度"
  },
  "names registry uri": {
    "one": "域名注册URI"
  },
  "nodes paragraph": {
    "one": "您可以根据需要添加任意数量的节点。每次请求时，dappy都会在可用节点中随机选择n个节点（n是<i>节点数</ i>值）并执行调用。节点越多则导航越准确、安全和分散。\n\ndappy每天都会运行基准测试以检查可用节点。"
  },
  "added by the user": {
    "one": "由用户添加"
  },
  "retreived from dappy network": {
    "one": "从分布式网络中恢复"
  },
  "cancel": {
    "one": "取消"
  },
  "download node addresses": {
    "one": "下载节点地址"
  },
  "import hard coded nodes": {
    "one": "输入硬编码节点"
  },
  "drop csv file": {
    "one": "获取csv文件"
  },
  "remove network": {
    "one": "移除网络"
  },
  "are you sure remove network": {
    "one": "是否确认移除网络？"
  },
  "yes": {
    "one": "是"
  },
  "add network": {
    "one": "添加网络"
  },
  "add network paragraph": {
    "one": "Dappy可以处理来自多个网络的dapps，目前仅支持RChain平台。\n您还可以通过填充“自定义chainID”字段为其命名来配置自定义本地/开发链。如果您使用本地/开发网络，请不要忘记进行相应的设置。"
  },
  "platform": {
    "one": "平台"
  },
  "network (defaults)": {
    "one": "网络（默认）"
  },
  "or custom network id": {
    "one": "或自定义网络ID"
  },
  "network name": {
    "one": "网络名称"
  },
  "auto import nodes": {
    "one": "自动连接节点"
  },
  "request": {
    "one": "请求",
    "other": "请求"
  },
  "node requests errors": {
    "one": "节点请求错误"
  },
  "requested at": {
    "one": "请求至"
  },
  "network id": {
    "one": "网络ID"
  },
  "show only names my accounts": {
    "one": "仅显示属于我的一个帐户的名称"
  },
  "type": {
    "one": "类型"
  },
  "owner": {
    "one": "所有者"
  },
  "blockchain address": {
    "one": "区块链地址"
  },
  "server": {
    "one": "服务器",
    "other": "服务器"
  },
  "origin": {
    "one": "原始名字"
  },
  "loaded at": {
    "one": "读取至"
  },
  "add local name paragraph": {
    "one": "除了从区块链自动加载的名称之外，您还可以添加仅在本地使用的自定义名称。您必须知道将用于验证加载的数据的公共密钥以及区块链地址。"
  },
  "record": {
    "one": "保存"
  },
  "DO NOT TRANSLATE": {
    "one": "域名"
  },
  "application type": {
    "one": "应用类型"
  },
  "ip": {
    "one": "IP"
  },
  "ip server": {
    "one": "IP服务器",
    "other": "IP服务器"
  },
  "setup ip servers": {
    "one": "设置IP服务器"
  },
  "back": {
    "one": "后退"
  },
  "ip address": {
    "one": "IP地址"
  },
  "host name": {
    "one": "主机名"
  },
  "certificate": {
    "one": "证书"
  },
  "primary server": {
    "one": "主服务器"
  },
  "primary server paragraph": {
    "one": "检查此服务器是否为您所拥有的服务器，我们将优先查询该服务器以加载网站。如果该服务器是第三方服务器，则不用执行此项检查。"
  },
  "add a server": {
    "one": "新增服务器"
  },
  "save ip servers": {
    "one": "保存IP服务器"
  },
  "purchase name": {
    "one": "购买域名"
  },
  "purchase a name": {
    "one": "购买域名"
  },
  "password for": {
    "one": "密码"
  },
  "dappy beta warning": {
    "one": "Dappy beta版本警告：此Dappy版本与Beta网络链接。即使需要REV付款，名称所有权也不会在将来提供任何所有权保证。网络可能会重新启动，可能会发生一些错误，最终所有权都将丢失。 也会根据REV价格应进行调整，以使域名保持在3美元以下。"
  },
  "use private key": {
    "one": "使用私钥"
  },
  "update name": {
    "one": "更新域名"
  },
  "update a name": {
    "one": "更新一个域名"
  },
  "name request successes": {
    "one": "域名请求成功"
  },
  "duration": {
    "one": "期限"
  },
  "nodes reached": {
    "one": "已连接节点"
  },
  "nodes not reached": {
    "one": "未连接节点"
  },
  "error": {
    "one": "错误",
    "other": "错误"
  },
  "success": {
    "one": "成功",
    "other": "成功"
  },
  "names paragraph 3": {
    "one": "当然，它一定不能与现有名称冲突。"
  },
  "dapp (web application)": {
    "one": "dapp（网页应用）"
  },
  "deploy (step 1)": {
    "one": "部署（第1步）"
  },
  "deploy dapp note": {
    "one": "<b>注意：</ b> 在主网上上传文件和创建区块需要时间。 Dappy目前尝试15分钟的时间标准来获取地址。您可以使用dappy-cli JS库将任何文件或Web应用程序上传到区块链。"
  },
  "predefined dapps": {
    "one": "预定义Dapps"
  },
  "javascript libraries": {
    "one": "Javascript库"
  },
  "javascript libraries expl": {
    "one": "Dappy浏览器中本地可用的Javascript库。"
  },
  "javascript code": {
    "one": "javascript代码"
  },
  "javascript code expl": {
    "one": "您可以直接删除.js文件"
  },
  "css libraries": {
    "one": "css库"
  },
  "css libraries expl": {
    "one": "Dappy浏览器提供本地CSS（样式）库。"
  },
  "css code": {
    "one": "css代码"
  },
  "css code expl": {
    "one": "您可以直接删除.css文件"
  },
  "html code": {
    "one": "html代码"
  },
  "html code expl": {
    "one": "您可以直接删除.html或.dpy文件"
  },
  "next": {
    "one": "下一个"
  },
  "file": {
    "one": "文件"
  },
  "file upload (step 1)": {
    "one": "文件上传（第1步）"
  },
  "deploy file note": {
    "one": "<b>注意：</ b> 在主网上上传文件和创建区块需要时间。 Dappy使用约15分钟获取地址。您可以使用dappy-cli JS库将任何文件或Web应用程序上传到区块链。"
  },
  "drop any file": {
    "one": "将您要上传的任何文件拖放到区块链（最大256kB）。"
  },
  "rholang": {
    "one": "rholang"
  },
  "deploy rholang (step 1)": {
    "one": "部署rholang （第1步)"
  },
  "sent at": {
    "one": "发送到"
  },
  "id (local)": {
    "one": "id（本地）"
  },
  "status": {
    "one": "状态"
  },
  "network": {
    "one": "网络",
    "other": "网络"
  },
  "submitting": {
    "one": "提交"
  },
  "field required": {
    "one": "必填项缺失"
  },
  "value must between 0 and 100": {
    "one": "值的范围需在0-100之间"
  },
  "value must between 1 and 10": {
    "one": "值的范围需在1-10之间"
  },
  "value must between 51 and 100": {
    "one": "值的范围需在51-100之间"
  },
  "account": {
    "one": "账户",
    "other": "账户"
  },
  "add account paragraph": {
    "one": "通过使用帐户，您可以避免每次发送交易时都输入私钥，并对REV余额进行跟踪。您可以根据需要拥有任意数量的帐户。使用密码对私钥进行了加密，创建者是唯一知晓者。\n\n当要求选择用于支付交易的账户时，将自动选择主账户。\n\n<b>注意：</ b> 通过主请求进行区块创建和余额更新需要大约10分钟。"
  },
  "main": {
    "one": "主账户"
  },
  "rev": {
    "one": "REV",
    "other": "REV"
  },
  "name taken": {
    "one": "名字已被占用"
  },
  "password length": {
    "one": "密码必须介于8到32个字符之间"
  },
  "private key invalid": {
    "one": "私钥有问题，请检查它是否是有效的secp256k1私钥"
  },
  "at least one upper": {
    "one": "警告：我们建议您在密码中至少包含一个大写字符"
  },
  "at least one lower": {
    "one": "警告：我们建议您在密码中至少包含一个小写字母"
  },
  "at least one digit": {
    "one": "警告：我们建议您在密码中至少输入一个数字"
  },
  "at least one special": {
    "one": "警告：我们建议您在密码中至少包含一个特殊字符＃？！@ $$％^＆*-"
  },
  "add account": {
    "one": "添加账户"
  },
  "did not find node": {
    "one": "找不到要导入的任何节点"
  },
  "import nodes": {
    "one": "导入节点"
  },
  "ok": {
    "one": "OK"
  },
  "do you want import nodes": {
    "one": "是否要导入以下节点？"
  },
  "yes import": {
    "one": "是的，请导入"
  },
  "this node is on": {
    "one": "此节点已打开，单击以将其禁用"
  },
  "this node is off": {
    "one": "该节点已关闭，单击以将其激活"
  },
  "add a node": {
    "one": "新增节点"
  },
  "ssl established": {
    "one": "建立加密的SSL连接"
  },
  "ssl not established": {
    "one": "无法建立加密的SSL连接"
  },
  "remove server": {
    "one": "删除服务器"
  },
  "must set ip": {
    "one": "IP地址必须设置"
  },
  "ip must be unique": {
    "one": "IP地址必须唯一"
  },
  "ip must be valid": {
    "one": "IP必须是有效的ipv6或ipv4地址"
  },
  "host must be set": {
    "one": "必须设置主机"
  },
  "host must be valid": {
    "one": "主机不能以点开头，并且只能包含小写字母，数字和点"
  },
  "cert must be set": {
    "one": "必须设置证书"
  },
  "purchase name paragraph short": {
    "one": "使用Dappy拥有和分发Web应用程序或文件的第一步是拥有一个域名。\n只需购买一个可用的名称，并将其链接到您之前拥有的文件或Web应用程序即可上传到区块链上。"
  },
  "record exists": {
    "one": "该记录已经存在"
  },
  "at least on ip server": {
    "one": "至少一台IP服务器必须链接到您的域名"
  },
  "name request errors": {
    "one": "名称请求错误"
  },
  "record does not exist": {
    "one": "该记录不存在"
  },
  "record is local": {
    "one": "该记录是本地记录，您可以删除并重新创建它"
  },
  "current": {
    "one": "当前"
  },
  "wrong password": {
    "one": "密码错误"
  },
  "private key does not match": {
    "one": "私钥与dapp识别所需的公钥不匹配"
  },
  "private key to identify": {
    "one": "公钥识别"
  },
  "use account": {
    "one": "使用账户"
  },
  "dapp requires identification": {
    "one": "Dapp需要身份证明"
  },
  "discard identification": {
    "one": "丢弃识别"
  },
  "identify": {
    "one": "识别"
  },
  "previous": {
    "one": "上一个"
  },
  "discarded by user": {
    "one": "被用户丢弃"
  },
  "dapp requests payment": {
    "one": "Dapp要求区块链付款"
  },
  "discard transaction": {
    "one": "放弃交易"
  },
  "send transaction": {
    "one": "发送交易"
  },
  "phlo limit superior to one": {
    "one": "Phlo限制必须大于1"
  },
  "dapp wishes send transaction": {
    "one": "Dapp希望发送交易"
  },
  "signatures": {
    "one": "签名"
  },
  "n signature(s) will be generated": {
    "one": "将生成签名"
  },
  "see required signature(s)": {
    "one": "查看要求的签名"
  },
  "code": {
    "one": "代码"
  },
  "see code": {
    "one": "查看代码"
  },
  "download file": {
    "one": "下载文件"
  },
  "block": {
    "one": "区块"
  },
  "language": {
    "one": "语言"
  },
  "english": {
    "one": "英语"
  },
  "chinese": {
    "one": "中文"
  },
  "to": {
    "one": "发送至"
  },
  "deploy (step 2)": {
    "one": "部署（第2步）"
  },
  "deploy (step 3)": {
    "one": "部署（第3步）"
  },
  "deploy rholang (step 2)": {
    "one": "部署rholang （第2步)"
  },
  "mute": {
    "one": "静音"
  },
  "unmute": {
    "one": "取消静音"
  },
  "deploy": {
    "one": "部署"
  },
  "save nodes": {
    "one": "保存节点"
  },
  "deploy dapp": {
    "one": "部署应用"
  },
  "remove tab": {
    "one": "关闭选项卡"
  },
  "stop tab": {
    "one": "停止选项卡"
  },
  "reputation badges": {
    "one": "徽章"
  },
  "result": {
    "one": "结果",
    "other": "结果"
  },
  "menu browse": {
    "one": "浏览"
  },
  "update balances": {
    "one": "更新余额"
  },
  "record regexp": {
    "one": "名称必须以字母开头，并且只包含字母和数字（a-z，0-9）。"
  },
  "menu gcu": {
    "one": "般使用条件 "
  },
  "save box": {
    "one": "安全盒"
  },
  "password for account": {
    "one": "密码帐户"
  },
  "Copy box address": {
    "one": "复制盒子地址"
  },
  "copy contract address": {
    "one": "复制合约地址"
  },
  "remove box": {
    "one": "移除盒子"
  },
  "token box": {
    "one": "代币盒子",
    "other": "代币盒子"
  },
  "add existing token box": {
    "one": "添加一个现有的代币盒"
  },
  "failed to deploy box": {
    "one": "部署盒子失败"
  },
  "at least one node network": {
    "one": "您需要连接到一个至少有一个端点可用的网络上"
  },
  "deploy a new token box": {
    "one": "部署一个新的代币盒"
  },
  "set main account": {
    "one": "将此账户设为主账户"
  },
  "no network cannot send revs": {
    "one": "没有找到网络，不能发送REVs"
  },
  "back to accounts": {
    "one": "返回账户"
  },
  "box definition": {
    "one": "一个盒子可以包含来自一个或多个合约的一个或多个钱包。一个钱包可以是一个NFT，也可以是一个代表可替换的代币，这取决于它所链接的RChain-Token合约。"
  },
  "box super key definition": {
    "one": "一个盒子可以储存超级钥匙。通常情况下，您为您部署的合约拥有一把超级钥匙，此功能使您能够创建钱包，您也可以锁定合约，使其失去这种能力。"
  },
  "quantity": {
    "one": "数量"
  },
  "check wallets": {
    "one": "检查您的钱包/账户"
  },
  "deploy ft": {
    "one": "部署一份可替换物品的合约（FT）"
  },
  "deploy nft": {
    "one": "部署非同质化（NFT）的合同"
  },
  "d network is live": {
    "one": "d 网络是可用的"
  },
  "d network definition": {
    "one": "d网络是dappy的主要网络。加入互联网的未来，现在就在dappy上获得一个域名吧！"
  },
  "copy address": {
    "one": "复制地址"
  },
  "record length": {
    "one": "名称长度必须在1到24之间"
  },
  "name is available": {
    "one": "域名是可用的！"
  },
  "at price": {
    "one": "根据价格"
  },
  "name is for sale": {
    "one": "域名可以出售！"
  },
  "name is not for sale": {
    "one": "域名已被占用，不出售"
  },
  "lookup name": {
    "one": "查询域名"
  },
  "reset": {
    "one": "重置"
  },
  "name public key and box public key different": {
    "one": "域名的公钥与您的账户公钥不同，交易可能会失败"
  },
  "name box address and box address different": {
    "one": "域名盒不同于您的帐户地址，交易可能会失败"
  },
  "contract": {
    "one": "合约"
  },
  "deploy ft contract": {
    "one": "如果将创建、交易和交换的代币是可替换的，例如它们可以代表公司的股份、黄金代币、类似ERC-20的代币等，则部署一个FT合约。"
  },
  "ft contract for tipboard": {
    "one": "如果您想使用提示板，请部署一个FT合同。"
  },
  "deploy nft contract": {
    "one": "如果代币代表稀缺的对象，如电影院中的特定座位、视频游戏中的稀缺物品，或域名系统（如dappy名字系统）中的稀缺域名等，则部署NFT合约。"
  },
  "rchain token nft": {
    "one": "RChain代币，用于非同质代币（NFT）"
  },
  "rchain token ft": {
    "one": "可替换代币的RChain代币"
  },
  "deploy contract": {
    "one": "部署合同"
  },
  "dappy opensource warning": {
    "one": "这个程序不与FABCO / DAPPY的任何私人服务器互动。它不依赖于任何中心化的服务或服务器。私钥存储在您的计算机上，并以您的密码加密。Dappy浏览器是开放的soruce，但基本上不受审计的软件。我们建议您只使用不重要的REV/ETH地址和小金额的账户。\n\n使用Dappy，转移资金，参考私钥和公钥，风险自负。"
  },
  "purchase a name 2": {
    "one": "域名是dappy生态系统的核心资产，您可以用一个域名来引用您在互联网网络上的网站（IP应用），您可以把您的域名指向一个HTML文件或您在区块链（dapp）上上传的任何其他文件，您也可以用它来接收付款，或作为一种投机资产。"
  },
  "operation on name successful": {
    "one": "✓ 交易已成功发送至区块链。在交易处理完毕后，您的域名应该在三十或四十分钟内出现或被更新，新的域名被网络成员索引。"
  },
  "warning wait for update": {
    "one": "不要多次尝试更新或购买域名在同一天，只需检查交易状态并等待。"
  },
  "you need box": {
    "one": "您必须有一个部署了代币盒的账户，才能购买一个域名（NFT"
  },
  "add one locally 2": {
    "one": "添加一个用于测试的本地域名"
  },
  "update name paragraph 2": {
    "one": "与一个域名相关的数据可以由所有者随时更新。它可以指向区块链上的另一个文件，或者从dapp变成IP应用，反之亦然。"
  },
  "add local name dev": {
    "one": "添加本地域名（开发）"
  },
  "purchase name fee": {
    "one": "截至目前，从dappy域名系统购买的每个域名都要收取1%的费用，以帮助团队发展和确保平台安全。REV价格的99%将归属于当前的域名所有者，1%归属于域名系统合约的所有者。"
  }
}