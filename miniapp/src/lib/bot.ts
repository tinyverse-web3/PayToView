class Bot {
  forward(ContractID: string) {
    const { VITE_TG_BOT } = import.meta.env;
    const url = `${VITE_TG_BOT}?start=${window.btoa(
      `cmd=fwd&work_id=${ContractID}`,
    )}`;
    console.log(url);
    // eslint-disable-next-line no-debugger
    debugger;
    window.open(url);
  }
}

const bot = new Bot();
export default bot;
