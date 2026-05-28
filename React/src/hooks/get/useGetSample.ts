import { useQuery } from "@tanstack/react-query";
import { TableParamsType } from "../../component/constant/ParamsType";
import { AxiosInstance } from "../../utils/interceptor";

const useGet = (search?: TableParamsType) => {
  return useQuery({
    queryKey: ["mustBeUnique", search],
    queryFn: async () => {
      return await AxiosInstance.get("/sample", {
        params: {
          search,
        },
      });
    },
  });
};

export default useGet;
