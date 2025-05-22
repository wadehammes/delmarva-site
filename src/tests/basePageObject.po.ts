// eslint-disable testing-library/no-node-access

export interface BasePageObjectProps {
  debug?: boolean;
  raiseOnFind?: boolean;
}

export class BasePageObject {
  private readonly debug: boolean;
  private readonly raiseOnFind: boolean;

  constructor(
    { debug, raiseOnFind }: BasePageObjectProps = {
      debug: false,
      raiseOnFind: false,
    },
  ) {
    this.debug = Boolean(debug);
    this.raiseOnFind = Boolean(raiseOnFind);
  }

  private debugLog(msg: string) {
    if (this.debug) {
      // eslint-disable-next-line no-console -- jest console debugging
      console.debug(msg);
    }
  }
}
