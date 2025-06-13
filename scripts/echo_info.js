import echoInfoList from '../info_data/echo_info_list.json' assert { type: 'json' };

export function getAllEchoes() {
  return echoInfoList;
}
