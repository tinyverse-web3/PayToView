import { Request } from './request';

export class DauthAccount {
  private readonly app;
  request: Request = new Request();
  constructor(app = 'mtv') {
    this.app = app;
  }
  /**
   * 创建账户
   */
  async createMasterAccount() {
    return this.request.invoke({
      name: 'createMasterAccount',
      data: {},
    });
  }
  /**
   * 验证邮箱
   */
  async verifyEmail({ account, verifyCode }: any) {
    return this.request.invoke({
      name: 'verify',
      data: {
        account,
        verifyCode,
      },
    });
  }
  async updatePasswordByGuardian({ account, verifyCode, password }: any) {
    return this.request.invoke({
      name: 'updatePasswordByGuardian',
      data: {
        account,
        verifyCode,
        password,
      },
    });
  }
  async getMnemonic() {
    return this.request.invoke({
      name: 'getMnemonic',
      method: 'get',
    });
  }
  async downloadMnemonic() {
    return this.request.invoke({
      name: 'downloadMnemonic',
      method: 'get',
    });
  }
  async retrieveAccountByUploadMnemonic({
    file,
    TextPrivateData,
    PasswordPrivateData,
    CustomPrivateData,
  }: {
    file: File;
    TextPrivateData: string;
    PasswordPrivateData: string;
    CustomPrivateData: string;
  }) {
    const formData = new FormData();
    formData.append('File', file);
    formData.append('TextPrivateData', TextPrivateData);
    formData.append('PasswordPrivateData', PasswordPrivateData);
    formData.append('CustomPrivateData', CustomPrivateData);
    return this.request.invoke({
      name: 'retrieveAccountByUploadMnemonic',
      method: 'post',
      formData: formData,
    });
  }
  async getBalance() {
    return this.request.invoke({
      name: 'getBalance',
      method: 'get',
    });
  }
  async applyDailyReward() {
    return this.request.invoke({
      name: 'applyDailyReward',
      method: 'get',
    });
  }
  async applyGuardianReward() {
    return this.request.invoke({
      name: 'applyGuardianReward',
      method: 'get',
    });
  }
  async applyInviterReward(InvitationCode: string) {
    return this.request.invoke({
      name: 'applyInviteReward',
      method: 'get',
      data: {
        InvitationCode,
      },
    });
  }
  async applyVaultReward() {
    return this.request.invoke({
      name: 'applyVaultReward',
      method: 'get',
    });
  }
  async getInvitationCode() {
    return this.request.invoke({
      name: 'getInvitationCode',
      method: 'get',
    });
  }
  async getRewardList() {
    return this.request.invoke({
      name: 'getRewardList',
      method: 'get',
    });
  }
  async invokeReward(RewardID: string) {
    return this.request.invoke({
      name: 'invokeReward',
      method: 'get',
      data: {
        RewardID,
      },
    });
  }
  async getRewardStatusList() {
    return this.request.invoke({
      name: 'getRewardStatusList',
      method: 'get',
    });
  }
  async getLatestVersion() {
    return this.request.invoke({
      name: 'getLatestVersion',
      method: 'get',
    });
  }
  async checkVersion(CurVersion: string) {
    return this.request.invoke({
      name: 'checkVersion',
      method: 'get',
      data: {
        CurVersion,
      },
    });
  }
  async getMsgProfile({ destPubkey }: any) {
    return this.request.invoke({
      name: 'msg/getProfile',
      method: 'get',
      data: {
        DestPubkey: destPubkey,
      },
    });
  }
  async saveMnemonic() {
    return this.request.invoke({
      name: 'saveMnemonic',
    });
  }
  async getNotes() {
    return this.request.invoke({
      name: 'getNotes',
    });
  }
  async delNote({ Id }: any) {
    return this.request.invoke({
      name: 'delNote',
      data: {
        Id,
      },
    });
  }
  async addNote({ Title, Content }: any) {
    return this.request.invoke({
      name: 'addNote',
      data: {
        Title,
        Content,
      },
    });
  }
  async modifyNote({ Id, Title, Content }: any) {
    return this.request.invoke({
      name: 'modifyNote',
      data: {
        Id,
        Title,
        Content,
      },
    });
  }
  async getCodebookList() {
    return this.request.invoke({
      name: 'codebook/getList',
    });
  }
  async delCodebook({ Id }: any) {
    return this.request.invoke({
      name: 'codebook/del',
      data: {
        Id,
      },
    });
  }
  async addCodebook({ Title, Account, Password, Url }: any) {
    return this.request.invoke({
      name: 'codebook/add',
      data: {
        Title,
        Account,
        Password,
        Url,
      },
    });
  }
  async modifyCodebook({ Id, Title, Account, Password, Url }: any) {
    return this.request.invoke({
      name: 'codebook/modify',
      data: {
        Id,
        Title,
        Account,
        Password,
        Url,
      },
    });
  }
  /**
   * 获取远程账户信息
   */
  async getAccountInfo() {
    return this.request.invoke({
      name: 'getAccountInfo',
      data: {},
    });
  }
  async cleanLocalAccount() {
    return this.request.invoke({
      name: 'cleanLocalAccount',
      data: {},
    });
  }
  async hasPassword() {
    return this.request.invoke({
      name: 'hasPassword',
      data: {},
    });
  }
  async checkPassword({ password }: any) {
    return this.request.invoke({
      name: 'checkPassword',
      data: { Password: password },
    });
  }
  async updatePassword({ oldPassword, newPassword }: any) {
    return this.request.invoke({
      name: 'updatePassword',
      data: {
        oldPassword,
        newPassword,
      },
    });
  }
  async lock() {
    return this.request.invoke({
      name: 'lock',
      data: {},
    });
  }
  async unlock(password: string) {
    return this.request.invoke({
      name: 'unlock',
      data: {
        password,
      },
    });
  }
  async hasLocalAccount() {
    return this.request.invoke({
      name: 'hasLocalAccount',
      data: {},
    });
  }
  /**
   * 获取本地账户信息
   */
  async loadLocalAccount() {
    return this.request.invoke({
      name: 'loadLocalAccount',
      data: {},
    });
  }
  /**
   * 验证邮箱
   */
  async retrieveAccountByGuardian({
    account,
    textPrivateData,
    passwordPrivateData,
    CustomPrivateData,
  }: any) {
    return this.request.invoke({
      name: 'retrieveAccountByGuardian',
      data: {
        account,
        TextPrivateData: textPrivateData,
        PasswordPrivateData: passwordPrivateData,
        CustomPrivateData: CustomPrivateData,
      },
    });
  }
  async retrieveAccountByMnemonic({
    mnemonic,
    textPrivateData,
    passwordPrivateData,
    CustomPrivateData,
  }: any) {
    return this.request.invoke({
      name: 'retrieveAccountByMnemonic',
      data: {
        Mnemonic: mnemonic,
        TextPrivateData: textPrivateData,
        PasswordPrivateData: passwordPrivateData,
        CustomPrivateData: CustomPrivateData,
      },
    });
  }
  async getQuestions4Retrieve({
    textPrivateData,
    passwordPrivateData,
    CustomPrivateData,
    Type,
  }: any) {
    return this.request.invoke({
      name: 'getQuestions4Retrieve',
      data: {
        textPrivateData,
        passwordPrivateData,
        CustomPrivateData,
        Type,
      },
    });
  }
  async retrieveAccountBySmartPrivacy({
    Questions,
    TextPrivateData,
    PasswordPrivateData,
    CustomPrivateData,
  }: any) {
    return this.request.invoke({
      name: 'retrieveAccountBySmartPrivacy',
      data: {
        Questions,
        TextPrivateData,
        PasswordPrivateData,
        CustomPrivateData,
      },
    });
  }
  /**
   * 发送验证码
   */
  async sendVerifyCode({ account, type = 'email' }: any) {
    return this.request.invoke({
      name: 'sendVerifyCode',
      data: {
        account,
        type,
      },
    });
  }
  /**
   * 生成个人特征数据
   */
  async generateFeatureData({
    textPrivateData,
    passwordPrivateData,
    CustomPrivateData,
  }: any) {
    return this.request.invoke({
      name: 'generateFeatureData',
      data: {
        textPrivateData,
        passwordPrivateData,
        CustomPrivateData,
      },
    });
  }

  /**
   * 保存密码
   * @param publicKey 公钥
   * @param password 密码
   */
  async savePassword({ publicKey, password }: any) {
    return this.request.invoke({
      name: 'savePassword',
      data: {
        publicKey,
        password,
      },
    });
  }
  /**
   * 更新用户名称
   * @param publicKey 公钥
   * @param name 用户名称
   */
  async updateName({ publicKey, name }: any) {
    return this.request.invoke({
      name: 'updateName',
      data: {
        publicKey,
        account: name,
      },
    });
  }
  /**
   * 获取密码
   * @param account 账户
   * @param verifyCode 验证码
   */
  async getPassword({ account, verifyCode }: any) {
    return this.request.invoke({
      name: 'getPassword',
      data: {
        account,
        verifyCode,
      },
    });
  }
  /**
   * 添加守护者
   * @param privateData 私有数据
   * @param publicKey 公钥
   * @param account 账户
   * @param verifyCode 验证码
   * @param type 类型
   */
  async addGuardian({ account, verifyCode, type = 'email' }: any) {
    return this.request.invoke({
      name: 'addGuardian',
      data: {
        account,
        verifyCode,
        type,
      },
    });
  }
  /**
   * 删除守护者
   * @param privateData 私有数据
   * @param account 账户
   * @param publicKey 公钥
   */
  async delGuardian({ account }: any) {
    return this.request.invoke({
      name: 'delGuardian',
      data: {
        Account: account,
      },
    });
  }
  /**
   * 获取用户信息
   * @param publicKey 公钥
   */
  async getUserInfo({ publicKey }: any) {
    return this.request.invoke({
      name: 'getUserInfo',
      data: {
        publicKey,
      },
    });
  }

  /**
   * 保存 SSS 数据
   * @param publicKey 公钥
   * @param sssData SSS 数据
   * @param privateData 私有数据
   * @param type 类型
   */
  async saveSssData({ publicKey, sssData, privateData, type }: any) {
    return this.request.invoke({
      name: 'saveSssData',
      data: {
        publicKey,
        sssData,
        privateData,
        type,
      },
    });
  }

  /**
   * 保存用户 SSS 数据
   * @param publicKey 公钥
   * @param sssData SSS 数据
   * @param type 类型
   * @param question 问题
   * @param answer 答案
   * @param privateData 私有数据
   */
  async saveSssDataForUser({
    publicKey,
    sssData,
    type,
    question,
    answer,
    privateData,
  }: any) {
    return this.request.invoke({
      name: 'saveSssDataForUser',
      data: {
        publicKey,
        sssData,
        question,
        answer,
        privateData,
        type,
      },
    });
  }

  /**
   * 获取用户 SSS 数据
   * @param publicKey 公钥
   * @param type 类型
   * @param question 问题
   * @param answer 答案
   * @param privateData 私有数据
   */
  async getSssDataForUser({
    publicKey,
    type,
    question,
    answer,
    privateData,
  }: any) {
    return this.request.invoke({
      name: 'getSssDataForUser',
      data: {
        publicKey,
        question,
        answer,
        privateData,
        type,
      },
    });
  }

  /**
   * 获取 SSS 数据
   * @param privateData 私有数据
   * @param account 账户
   * @param verifyCode 验证码
   * @param type 类型
   */
  async getSssData({ privateData, account, verifyCode, type }: any) {
    return this.request.invoke({
      name: 'getSssData',
      data: {
        privateData,
        account,
        verifyCode,
        type,
      },
    });
  }

  /**
   * 获取问题模版列表
   * @param type 问题模版类型，其中1表示默认问题模版，2表示自定义问题模版
   */
  async getTmpQuestions({ type }: { type: 1 | 2 }) {
    return this.request.invoke({
      name: 'getTmpQuestions',
      data: {
        type,
      },
    });
  }

  /**
   * 保存问题
   * @param privateData 私有数据
   * @param publicKey 公钥
   * @param questions 问题
   */
  async saveQuestions({ Type, Questions }: any) {
    return this.request.invoke({
      name: 'saveQuestions',
      data: {
        Questions,
        Type,
      },
    });
  }

  /**
   * 获取问题表
   * @param privateData 私有数据
   * @param appName 应用名称
   * @param publicKey 公钥
   */
  async getQuestions(Type: number) {
    return this.request.invoke({
      name: 'getQuestions',
      data: {
        Type,
      },
    });
  }

  /**
   * 存储数据
   * @param key 键
   * @param value 值
   * @param duration 持续时间
   */
  async put({ key, value, duration }: any) {
    if (value === null || value === undefined) {
      return;
    }
    return this.request.invoke({
      name: 'kv/get',
      data: {
        key: `/service/dauth/${key}`,
        value: value,
        duration,
      },
    });
  }

  /**
   * 获取数据
   * @param key 键
   */
  async get({ key }: any) {
    const res = await this.request.invoke({
      name: 'kv/get',
      data: {
        key: `/service/dauth/${key}`,
      },
    });
    let result;
    const { code, data } = res.data;
    return data;
  }
  async getDataSummary() {
    return this.request.invoke({
      method: 'get',
      name: 'data/getSummary',
    });
  }
  async getDataStatus() {
    return this.request.invoke({
      method: 'get',
      name: 'data/getStatus',
    });
  }
  async getDataList({ DataType }: any) {
    return this.request.invoke({
      method: 'get',
      name: 'data/getDatas',
      data: {
        DataType,
      },
    });
  }
  async getDataDetail({ DataType, Key, Cid }: any) {
    return this.request.invoke({
      method: 'get',
      name: 'data/getDataDetail',
      data: {
        DataType,
        Key,
        Cid,
      },
    });
  }
  /**
   * 铸造NFT文件
   * @param file 文件
   */
  async mintNftFile({
    file,
    Name,
    Description,
  }: {
    file: File;
    Name: string;
    Description: string;
  }) {
    const formData = new FormData();
    formData.append('File', file);
    formData.append('Name', Name);
    formData.append('Description', Description);
    return this.request.invoke({
      name: 'nft/mintFile',
      method: 'post',
      formData: formData,
    });
  }
  async transferNft({ WalletAddr, NftName, Amount }: any) {
    return this.request.invoke({
      name: 'nft/transferNFT',
      method: 'post',
      data: {
        WalletAddr,
        NftName,
        Amount,
      },
    });
  }
  async getNftList() {
    return this.request.invoke({
      method: 'get',
      name: 'nft/getNfts',
    });
  }
  async transferPoint({ WalletAddr, Amount, Gas, Comment }: any) {
    return this.request.invoke({
      method: 'post',
      name: 'transferScore',
      data: {
        WalletAddr,
        Amount,
        Gas,
        Comment,
      },
    });
  }
  async mintNftText({ Name, Content, Description }: any) {
    return this.request.invoke({
      method: 'post',
      name: 'nft/mintText',
      data: {
        Name,
        Content,
        Description,
      },
    });
  }
  async getNftDetail({ NftName }: any) {
    return this.request.invoke({
      name: 'nft/getNftDetail',
      method: 'get',
      data: {
        NftName,
      },
    });
  }
  async downloadNftFile({ NftName }: any) {
    return this.request.invoke({
      name: 'nft/download',
      method: 'get',
      data: {
        NftName,
      },
    });
  }
  async getTXDetails() {
    return this.request.invoke({
      name: 'getTXDetails',
      method: 'get',
    });
  }
  async getTXMore(Addr: string) {
    return this.request.invoke({
      name: 'getTXMore',
      method: 'get',
      data: {
        Addr,
      },
    });
  }
  /**
   * 上传 IPFS 文件
   * @param file 文件
   */
  async uploadIpfsFile({ file }: { file: File }) {
    const formData = new FormData();
    formData.append('file', file);
    return this.request.invoke({
      name: 'ipfs/uploadFile',
      method: 'post',
      formData: formData,
    });
  }
  async uploadAvatar({ file }: { file: File }) {
    const formData = new FormData();
    formData.append('File', file);
    return this.request.invoke({
      name: 'uploadAvatar',
      method: 'post',
      formData: formData,
    });
  }
  async setAvatar(NftName: string) {
    return this.request.invoke({
      name: 'setAvatar',
      method: 'post',
      data: {
        NftName,
      },
    });
  }
  async uploadAlbum({ file }: { file: File }) {
    const formData = new FormData();
    formData.append('File', file);
    return this.request.invoke({
      name: 'album/upload',
      method: 'post',
      formData: formData,
      timeout: 1000 * 200,
    });
  }
  async getAlbumList() {
    return this.request.invoke({
      name: 'album/getList',
      method: 'get',
    });
  }
  async downloadAlbum({ FileName }: any) {
    return this.request.invoke({
      name: 'album/download',
      method: 'get',
      data: {
        FileName,
      },
    });
  }
  async delAlbum({ FileName }: any) {
    return this.request.invoke({
      name: 'album/del',
      method: 'post',
      data: {
        FileName,
      },
    });
  }
  async uploadFile({
    file,
    type,
    password,
  }: {
    file: File;
    type: string;
    password?: string;
  }) {
    const formData = new FormData();
    formData.append('File', file);
    formData.append('Type', type);
    if (password) {
      formData.append('Password', password);
    }
    return this.request.invoke({
      name: 'file/upload',
      method: 'post',
      formData: formData,
    });
  }
  async getFileList({ type }: any) {
    return this.request.invoke({
      name: 'file/getList',
      method: 'get',
      data: {
        Type: type,
      },
    });
  }
  async delFile({ FileName, Type }: any) {
    return this.request.invoke({
      name: 'file/del',
      method: 'post',
      data: {
        FileName,
        Type,
      },
    });
  }
  async downloadFile({ FileName, Type, Password }: any) {
    return this.request.invoke({
      name: 'file/download',
      method: 'get',
      data: {
        FileName,
        Type,
        Password,
      },
    });
  }
  /**
   * 上传 IPFS 内容
   * @param content 内容
   */
  async uploadIpfsContent({ content }: { content: string }) {
    return this.request.invoke({
      name: 'ipfs/uploadContent',
      method: 'post',
      data: {
        content,
      },
    });
  }

  /**
   * 获取联系人列表
   */
  async createContactByMasterKey({ destPubkey }: any) {
    return this.request.invoke({
      name: 'msg/createContactByMasterKey',
      data: {
        DestPubKey: destPubkey,
      },
    });
  }
  async createContactByWalletKey({ destPubkey }: any) {
    return this.request.invoke({
      name: 'msg/createContactByWalletKey',
      data: {
        DestWalletKey: destPubkey,
      },
    });
  }
  async delContact({ destPubkey }: any) {
    return this.request.invoke({
      name: 'msg/delContact',
      data: {
        DestPubkey: destPubkey,
      },
    });
  }
  async getContacts() {
    return this.request.invoke({
      name: 'msg/getContacts',
      method: 'get',
      data: {},
    });
  }
  async clearContactMessage({ DestPubkey }: any) {
    return this.request.invoke({
      name: 'msg/clearContactMessage',
      method: 'post',
      data: { DestPubkey },
    });
  }

  /**
   * 发送消息
   * @param destPubkey 目标公钥
   * @param content 内容
   */
  async sendMsg({ destPubkey, content }: any) {
    return this.request.invoke({
      name: 'msg/sendMsg',
      method: 'post',
      data: {
        content,
        destPubkey,
      },
    });
  }
  async setContactAlias({ destPubkey, alias }: any) {
    return this.request.invoke({
      name: 'msg/setContactAlias',
      method: 'post',
      data: {
        Alias: alias,
        DestPubkey: destPubkey,
      },
    });
  }

  /**
   * 获取消息
   * @param destPubkey 目标公钥
   */
  async receiveMsgs({ destPubkey }: any) {
    return this.request.invoke({
      name: 'msg/receiveMsgs',
      method: 'get',
      data: {
        DestPubkey: destPubkey,
      },
    });
  }
  async getMsgAvatar({ destPubkey }: any) {
    return this.request.invoke({
      name: 'msg/getMsgAvatar',
      method: 'get',
      data: {
        DestPubkey: destPubkey,
      },
    });
  }

  /**
   * 获取所有消息
   * @param destPubkey 目标公钥
   */
  async getAllMsgs({ destPubkey }: any) {
    return this.request.invoke({
      name: 'msg/getAllMsgs',
      method: 'post',
      data: {
        DestPubkey: destPubkey,
      },
    });
  }
  async getMoreMsgs({ DestPubkey, Content }: any) {
    return this.request.invoke({
      name: 'msg/getMoreMsgs',
      method: 'post',
      data: {
        DestPubkey,
        Content,
      },
    });
  }
  async applyNewGun({
    GunName,
    ValidTime,
  }: {
    GunName: string;
    ValidTime: any;
  }) {
    return this.request.invoke({
      name: 'gun/applyGun',
      method: 'post',
      data: {
        gunname: GunName,
        validtime: ValidTime,
      },
    });
  }

  async renewGun({ GunName, ValidTime }: { GunName: string; ValidTime: any }) {
    return this.request.invoke({
      name: 'gun/renewGun',
      method: 'post',
      data: {
        gunname: GunName,
        validtime: ValidTime,
      },
    });
  }

  async getGun({ GunName }: { GunName: string }) {
    return this.request.invoke({
      name: 'gun/getGunDetails',
      method: 'post',
      data: {
        gunname: GunName,
      },
    });
  }

  async getGunList() {
    return this.request.invoke({
      name: 'gun/getGunList',
      method: 'post',
    });
  }
  async addAuthenticator({ Account, Secret }: any) {
    return this.request.invoke({
      name: 'authenticator/add',
      method: 'post',
      data: {
        Account,
        Secret,
      },
    });
  }
  async getAuthenticatorCodes() {
    return this.request.invoke({
      name: 'authenticator/getAllCodes',
      method: 'get',
    });
  }
  async getAuthenticatorAccounts() {
    return this.request.invoke({
      name: 'authenticator/getAllAccounts',
      method: 'get',
    });
  }
  async getAuthenticatorCode({ AccountName }: any) {
    return this.request.invoke({
      name: 'authenticator/getAccountCode',
      method: 'get',
      data: {
        AccountName,
      },
    });
  }
  async getAuthenticatorSecret({ AccountName }: any) {
    return this.request.invoke({
      name: 'authenticator/getAccountSecret',
      method: 'get',
      data: {
        AccountName,
      },
    });
  }
  async delAuthenticatorAccount({ AccountName }: any) {
    return this.request.invoke({
      name: 'authenticator/delAccount',
      method: 'get',
      data: {
        AccountName,
      },
    });
  }
  async refreshAuthenticatorTime({ AccountName }: any) {
    return this.request.invoke({
      name: 'authenticator/getRefreshTime',
      method: 'get',
      data: {
        AccountName,
      },
    });
  }
  async generateGoogleSecret() {
    return this.request.invoke({
      name: 'authenticator/generateGoogleSecret',
      method: 'get',
    });
  }
  
}
