import type { Handler as GetHandler } from "../../functions/project/get";
import type { InnerPromise } from "@dvargas92495/ui/dist/types";
import axios from "axios";

export type Props = InnerPromise<ReturnType<GetHandler>>;

const getStaticProps = ({
  params: { id },
}: {
  params: { id: string };
}): Promise<{ props: Props }> => {
  return axios
    .get<Props>(`${process.env.API_URL}/project?uuid=${id}`)
    .then((r) => ({
      props: r.data,
    }));
};

export default getStaticProps;
