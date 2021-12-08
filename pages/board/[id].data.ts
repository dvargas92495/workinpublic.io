import type { Handler as GetHandler } from "../../functions/funding-board/get";
import axios from "axios";
import formatError from "@dvargas92495/api/formatError";

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
    }))
    .catch((e) => {
      throw new Error(formatError(e));
    });
};

export default getStaticProps;
