import type { Handler as GetHandler } from "../../functions/funding-board/get";
import type { InnerPromise } from "@dvargas92495/ui/dist/types";
import axios from "axios";

export type Props = InnerPromise<ReturnType<GetHandler>>;

const getStaticProps = ({
  params: { id },
}: {
  params: { id: string };
}): Promise<{ props: Props }> => {
  return axios
    .get<Props>(`${process.env.API_URL}/funding-board?uuid=${id}`)
    .then((r) => ({
      props: r.data,
    }));
};

export default getStaticProps;
