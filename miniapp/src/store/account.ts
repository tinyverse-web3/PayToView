import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import dauth from '@/lib/dauth';
interface AccountInfo {
  publicKey: string;
  avatar: string;
  name: string;
  address: string;
  messageKey: string;
  passwordPrivateData: string;
  textPrivateData: string;
  customPrivateData: string;
  safeLevel: number;
  isDefaultPwd: boolean;
  bindStatus: boolean;
  maintainPhrase: boolean;
  maintainProtector: boolean;
  maintainQuestion: boolean;
  hasFeatureData: boolean;
  isBackupMnemonic: boolean;
  hasGuardian: boolean;
  hasPrivacy: boolean;
  hasPrivacyByVault: boolean;
  hasGuardianByVault: boolean;
  isBackupQuestion: boolean;
  privacyInfo: any;
  note_ipfs: string;
  pointAccount: any;
  subAccount: any[];
  guardians: any[];
}
interface AccountState {
  accountInfo: AccountInfo;
  balance: number;
  setAccount: (accountInfo: any) => void;
  setBalance: (b: number) => void;
  getLocalAccountInfo: () => void;
  reset: () => void;
}

export const useAccountStore = create<AccountState>()(
  devtools(
    persist(
      (set, get) => ({
        accountInfo: {
          publicKey: '',
          avatar: '',
          name: '',
          address: '',
          messageKey: '',
          passwordPrivateData: '',
          textPrivateData: '',
          customPrivateData: '',
          safeLevel: 0,
          isDefaultPwd: true,
          bindStatus: false,
          maintainPhrase: false,
          maintainProtector: false,
          maintainQuestion: false,
          hasFeatureData: false,
          isBackupMnemonic: false,
          hasGuardian: false,
          hasPrivacy: false,
          hasPrivacyByVault: false,
          hasGuardianByVault: false,
          isBackupQuestion: false,
          privacyInfo: {},
          note_ipfs: '',
          subAccount: [],
          guardians: [],
          pointAccount: {},
        },
        balance: 1000,
        setBalance: (b: number) => {
          set({ balance: b });
        },
        getLocalAccountInfo: async () => {
          const { code, data: localInfo } =
            await dauth.account.loadLocalAccount();
          if (code !== '000000') return;

          let { accountInfo } = get();
          accountInfo = Object.assign(accountInfo, {
            publicKey: localInfo.PublicKey,
            name: localInfo.Name,
            address: localInfo.Address,
            messageKey: localInfo.MessageKey,
            passwordPrivateData: localInfo.PasswordPrivateData || '',
            textPrivateData: localInfo.TextPrivateData || '',
            customPrivateData: localInfo.CustomPrivateData || '',
            hasFeatureData: localInfo.IsSetVault || false,
            isBackupMnemonic: !!localInfo?.IsGenerateMnemonic || false,
            isBackupQuestion:
              !!localInfo?.CustomQuestionSets?.length ||
              !!localInfo?.StandardQuestionSets?.length ||
              false,
            hasGuardian: !!localInfo.HasGuardian || false,
            hasGuardianByVault: !!localInfo.HasGuardianByVault || false,
            hasPrivacy: !!localInfo.HasPrivacy || false,
            hasPrivacyByVault: !!localInfo.HasPrivacyByVault || false,
            guardians: localInfo.Guardians || [],
            bindStatus: !!localInfo.Guardians?.length,
            avatar: localInfo.Avatar,
            isDefaultPwd: !localInfo.IsChangedPassword,
            safeLevel: localInfo.SafeLevel || 0,
          });
          set({ accountInfo });
        },
        setAccount: (accountInfo: any) => {
          console.log('setAccount', accountInfo);
          set((state) => ({
            accountInfo: {
              ...state.accountInfo,
              ...accountInfo,
            },
          }));
        },
        reset: () => {
          set({
            accountInfo: {
              publicKey: '',
              avatar: '',
              name: '',
              address: '',
              messageKey: '',
              passwordPrivateData: '',
              textPrivateData: '',
              customPrivateData: '',
              safeLevel: 0,
              isDefaultPwd: true,
              bindStatus: false,
              maintainPhrase: false,
              maintainProtector: false,
              maintainQuestion: false,
              hasFeatureData: false,
              isBackupMnemonic: false,
              isBackupQuestion: false,
              hasGuardian: false,
              hasPrivacy: false,
              hasPrivacyByVault: false,
              hasGuardianByVault: false,
              privacyInfo: {},
              note_ipfs: '',
              subAccount: [],
              guardians: [],
              pointAccount: {},
            },
          });
        },
      }),
      {
        name: 'account-store',
      },
    ),
  ),
);
