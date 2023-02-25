import useSWR from 'swr';

const useSign = (session) => {
  const apiRoute = `/api/vagachain/sign?session=${session}`;
  const { data, error } = useSWR(`${apiRoute}`);
  return {
    ...data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useSign;
