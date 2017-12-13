import tableFactory from './tableFactory';

export default async function lifeExpectancyTable() {
  const getData = async () => {
    try {
      const response = await fetch('data/who.json');
      const rawData = await response.json();
      return rawData.filter()
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }
}
