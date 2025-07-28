// eslint-disable testing-library/no-node-access

export interface BasePageObjectProps {
  debug?: boolean;
  raiseOnFind?: boolean;
}

export class BasePageObject {
  debug: boolean;
  raiseOnFind: boolean;

  constructor(
    { debug, raiseOnFind }: BasePageObjectProps = {
      debug: false,
      raiseOnFind: false,
    },
  ) {
    this.debug = Boolean(debug);
    this.raiseOnFind = Boolean(raiseOnFind);
  }
}
