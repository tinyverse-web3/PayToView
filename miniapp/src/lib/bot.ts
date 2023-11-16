class Bot {
  forward(ConstractName: string) {
    const { VITE_TG_BOT } = import.meta.env;
    const url = `${VITE_TG_BOT}?start=${window.btoa(
      `cmd=fwd&work_id=${ConstractName}`,
    )}`;
    console.log(url);
    window.open(url);
  }
}

const bot = new Bot();
export default bot;
