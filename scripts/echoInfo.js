import echoInfoList from '../info_data/echoInfoList.json' assert { type: 'json' };

export function getAllEchoes() {
  return echoInfoList;
}
