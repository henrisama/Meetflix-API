import IContent from "./IContent";

export default interface IProfile {
  name: string;
  list: {
    wish: Array<IContent>;
    watched: Array<IContent>;
  };
}
