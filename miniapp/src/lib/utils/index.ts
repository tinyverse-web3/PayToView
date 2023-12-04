export const flattenListData = (list: any[]) => {
  return list?.map((v) => ({
    ContractID: v.ContractID,
    ContractName: v.ContractName,
    CommissionContractName: v.ContractInfo.CommissionContractName,
    Name: v.ContractInfo.Name,
    Cid: v.ContractInfo.Content.Cid,
    Fee: v.ContractInfo.Content.Fee,
    CidForpreview: v.ContractInfo.Content.CidForpreview,
    ContentType: v.ContractInfo.Content.ContentType,
    Description: v.ContractInfo.Content.Description,
    Ritio: v.Ritio,
  }));
};

export const file2array = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (e: any) => {
      const uint8Array = new Uint8Array(e.target.result);
      resolve(uint8Array);
    };
    reader.onerror = (err) => {
      reject(err);
    };
  });
};
export const generatePassword = (length: number = 8) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length),
    );
  }
  return password;
};

export const hideStr = (
  str: string,
  num: number = 10,
  placeholder = '*****',
) => {
  if (str) {
    return `${str?.substring(0, num)}${placeholder}${str?.substring(
      str?.length - num,
    )}`;
  }
  return '';
};