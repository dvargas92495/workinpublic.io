import type { Handler as GetHandler } from "../../functions/funding-board/get";
import axios from "axios";

export type Props = Awaited<ReturnType<GetHandler>>;

const getStaticProps = ({
  params: { id },
}: {
  params: { id: string };
}): Promise<{ props: Props }> => {
  return axios
    .get<Props>(`${process.env.API_URL}/funding-board?id=${id}`)
    .then((r) => ({
      props: r.data,
    }));
};

export default getStaticProps;
