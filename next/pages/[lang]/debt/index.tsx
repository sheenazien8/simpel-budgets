import { Button, CardList, EmptyState, Layout, Modal } from "@/ui";
import { useEffect, useState } from "react";
import { getDictionary } from "../dictionaries";
import { useDebtActions } from "@/actions";
import { MDebt } from "@/models";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { formatMoney, useHashRouteToggle } from "@/utils/helper";
import { useRouter } from "next/router";
import FormData from "@/components/debt/form-data";

interface IPage {
  dict: any;
  locale: string;
}

export async function getStaticProps(props: any) {
  const dict = await getDictionary(props.params.lang);
  return {
    props: {
      dict: dict,
      locale: props.params.lang,
    },
  };
}

export function getStaticPaths() {
  return {
    paths: [{ params: { lang: "id" } }, { params: { lang: "en" } }],
    fallback: false,
  };
}

export default function Page(props: IPage) {
  const [height, setHeight] = useState(0);
  const { get } = useDebtActions();
  const [debts, setDebts] = useState<MDebt[]>([]);
  const [isOpen, toggleActive] = useHashRouteToggle("#opened-modal");
  const router = useRouter();

  const load = async () => {
    const res = await get();
    setDebts(res ?? []);
    getContacts();
    toggleActive(false);
  };

  const getContacts = async () => {
    try {
      const supported = "contacts" in navigator && "ContactsManager" in window;
      console.log(navigator.permissions, supported);
    } catch (ex) {
      // Handle any errors here.
    }
  };

  useEffect(() => {
    load();
  }, [router]);

  useEffect(() => {
    setHeight(document?.documentElement?.offsetHeight - 250);
  }, []);

  return (
    <Layout title="Debt">
      <>
        <div className="flex justify-between items-center flex-row-reverse">
          <button
            type="button"
            className="inline-flex items-center rounded-lg border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            value="Tambah"
            onClick={() => {
              toggleActive(true);
            }}
          >
            <PlusIcon className="h-5" />
          </button>
        </div>
        <ul
          style={{ height: height }}
          role="list"
          className={`mt-3 grid grid-cols-1 content-start gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 overflow-x-scroll`}
        >
          {debts?.length == 0 && (
            <EmptyState
              title="Catatan hutang/piutang kosong"
              description="Fitur ini membantu kamu mencatat hutang/piutang yang kamu miliki."
              button={
                <div className="flex justify-center">
                  <Button
                    type="button"
                    onClick={() => {
                      toggleActive(true);
                    }}
                  >
                    <PlusIcon className="h-5" /> Tambah
                  </Button>
                </div>
              }
            />
          )}
          {debts?.map((debt: MDebt, index: number) => (
            <CardList
              key={index}
              title={
                <div className="flex justify-between items-center">
                  <p>{debt?.name}</p>
                </div>
              }
              icon={
                <div className="border border-white rounded-lg p-1">
                  {debt?.type == 2 ? (
                    <ArrowDownTrayIcon className="w-4 h-4 text-white" />
                  ) : (
                    <ArrowUpTrayIcon className="w-4 h-4 text-white" />
                  )}
                </div>
              }
              details={[
                debt?.description,
                <div className="flex italic justify-between" key={index}>
                  <div className="italic">Paid</div>
                  {formatMoney(debt?.paid, false) +
                    "/" +
                    formatMoney(debt?.amount, false)}
                </div>,
                debt?.type == 2 ? "Receivable" : "Payable",
              ]}
              onClick={() => router?.push(`/${props.locale}/debt/${debt?.id}`)}
            />
          ))}
        </ul>
        <Modal
          open={isOpen}
          setOpen={(status) => toggleActive(status)}
          title={"Tambah utang/piutang"}
        >
          <FormData
            initialValues={{
              type: "2",
            }}
            dict={props.dict}
            toggleActive={(status) => toggleActive(status)}
          />
        </Modal>
      </>
    </Layout>
  );
}
