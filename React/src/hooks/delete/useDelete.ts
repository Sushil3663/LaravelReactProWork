import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosInstance } from "../../utils/interceptor";
import { AxiosResponse } from "axios";

interface DeleteBulkPayload {
  ids: string[];
}

interface DeleteResponse {
  success: boolean;
  message: string;
  deletedCount: number;
  failedIds?: string[];
}

const useDeleteBulkTaxonomy = (): UseMutationResult<
  AxiosResponse<DeleteResponse>,
  Error,
  DeleteBulkPayload
> => {
  return useMutation({
    mutationFn: async (payload: DeleteBulkPayload) => {
      return await AxiosInstance.delete("/delete/bulk", { data: payload });
    },
    onSuccess: async (response) => {
      console.log("Successfully deleted:", response.data.deletedCount, "items");
    },
    onError: (error: Error) => {
      console.error("Failed to delete items:", error.message);
    },
    onSettled: () => {
      console.log("Mutation settled");
    },
  });
};

export default useDeleteBulkTaxonomy;
