import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Handle URL parameter replacement - if queryKey has more than one element
    let url = queryKey[0] as string;
    
    // If the URL contains a parameter placeholder (e.g., '/api/resource/:id')
    // and there's a second element in the queryKey, replace the placeholder
    if (queryKey.length > 1 && queryKey[1] !== undefined && queryKey[1] !== null) {
      // Check if the URL has a path parameter (indicated by ":")
      if (url.includes('/:')) {
        // Extract the parameter name
        const paramName = url.split('/:')[1];
        // Replace the placeholder with the actual value
        url = url.replace(`/:${paramName}`, `/${queryKey[1]}`);
      } else {
        // If no path parameter, append the ID to the URL
        url = `${url}/${queryKey[1]}`;
      }
    }
    
    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
