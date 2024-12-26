import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useState } from "react";
import {  Id } from "../../../../convex/_generated/dataModel";
import { useMemo } from "react";


type RequestType = { 
    body: string,
    image?: Id<"_storage">,
    workspaceId: Id<"workspaces">,
    channelId?: Id<"channels">,
    parentMessageId?: Id<"messages">,
 };
type ResponseType = Id<"messages"> | null;

type Options = {
    onSuccess?: (data: ResponseType) => void;
    onError?: (error: Error) => void;
    onSettled?: () => void;
    throwError?: boolean;
};

export const useCreateMessage = () => {
    const mutation = useMutation(api.messages.create);

    const [status, setStatus] = useState<"success" | "error" | "settled" | "pending" | null>(null);

    const [data, setData] = useState<ResponseType>(null);
    const [error, setError] = useState<Error | null>(null);


    const isPending = useMemo(() => status === "pending", [status]);
    const isSuccess = useMemo(() => status === "success", [status]);
    const isError = useMemo(() => status === "error", [status]);
    const isSettled = useMemo(() => status === "settled", [status]);

    const mutate = useCallback(async (values:RequestType, options?: Options) => {
        try {
            setData(null);
            setError(null);
            setStatus("pending");

            const response = await mutation(values);
            options?.onSuccess?.(response);
            return response;
        } catch (error) {
            setStatus("error");
            options?.onError?.(error as Error);
            if(options?.throwError) {
                throw error;
            }
        } finally {
            setStatus("settled");
            options?.onSettled?.();
        }
    }, [mutation]);

    return {
        mutate,
        data,
        error,
        isPending,
        isSuccess,
        isError,
        isSettled,
    };
};