import { createSimpleRestDataProvider } from "@refinedev/rest/simple-rest";
import { API_URL } from "./constants";
import {DataProvider, GetListParams, BaseRecord, GetListResponse} from "@refinedev/core"
import { mockSubjects } from "./mockData";

// export const { dataProvider, kyInstance } = createSimpleRestDataProvider({
//   apiURL: API_URL,
// });
export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>({resource}: GetListParams): Promise<GetListResponse<TData>> => {
    if(resource !== 'subjects'){
      return {data: [] as TData[], total: 0};
    }
    return {
      data: mockSubjects as unknown as TData[],
      total: mockSubjects.length
    }
  },
  getOne: async () => {throw new Error('This function is not present in mock')},
  create: async () => {throw new Error('This function is not present in mock')},
  update: async () => {throw new Error('This function is not present in mock')},
  deleteOne: async () => {throw new Error('This function is not present in mock')},
  getApiUrl: () =>  ''
}
