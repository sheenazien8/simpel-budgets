import { Card, CardList, Layout } from "@/ui";
import {
  BuildingLibraryIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  FingerPrintIcon,
  FlagIcon,
  GlobeAltIcon,
  LockClosedIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  TableCellsIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { getDictionary } from "../dictionaries";
import { useRouter } from "next/router";
import { IProfile } from "@/models";
import { useAuthAction } from "@/actions";
import { useConfirm } from "@/packages/confirm";

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
  const { confirm } = useConfirm();
  const menus: any = {
    settings: [
      {
        name: "Month",
        description: "Manage your month",
        icon: <CalendarIcon className="h-6 w-6 text-white" />,
        bgColor: "bg-yellow-600",
        href: `/${props.locale}/months`,
      },
      {
        name: "Accounts",
        description: "Manage your accounts",
        icon: <BuildingLibraryIcon className="h-6 w-6 text-white" />,
        bgColor: "bg-yellow-600",
        href: `/${props.locale}/accounts`,
      },
      {
        name: <div className="py-2.5">Set language</div>,
        icon: <GlobeAltIcon className="h-6 w-6 text-white" />,
        bgColor: "bg-yellow-600",
        onClick: () => {
          confirm({
            title: "Change language",
            description: "Are you sure to change language?",
            yes: () => {
              router.push("/id/user");
            },
            no: () => {
              router.push("/en/user");
            },
            style: {
              yes: "bg-white !text-black ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
            },
            yesLabel: "Bahasa Indonesia",
            noLabel: "English",
            icon: <GlobeAltIcon className="h-6 w-6 text-gray-400" />,
          });
        },
      },
    ],
    menu: [
      {
        name: "Goals",
        description: "Manage your Goals",
        icon: <FlagIcon className="h-6 w-6 text-white" />,
        bgColor: "bg-indigo-600",
        href: `/${props.locale}/goals`,
      },
      {
        name: "Debt",
        description: "Manage your Debt",
        icon: <TableCellsIcon className="h-6 w-6 text-white" />,
        bgColor: "bg-indigo-600",
        href: `/${props.locale}/debt`,
      },
    ],
    security: [
      {
        name: "Set Pin",
        description: "Use pin to login to the app.",
        icon: <LockClosedIcon className="h-6 w-6 text-white" />,
        bgColor: "bg-indigo-600",
      },
      {
        name: "Biometric login",
        description: "Use your fingerprint to login to the app.",
        icon: <FingerPrintIcon className="h-6 w-6 text-white" />,
        bgColor: "bg-indigo-600",
      },
    ],
    about: [
      {
        name: <div className="py-2.5">Help</div>,
        icon: <QuestionMarkCircleIcon className="h-6 w-6 text-white" />,
        bgColor: "bg-yellow-600",
      },
      {
        name: <div className="py-2.5">Contact</div>,
        icon: <ChatBubbleLeftIcon className="h-6 w-6 text-white" />,
        bgColor: "bg-yellow-600",
      },
      {
        name: <div className="py-2.5">About</div>,
        icon: <div>v1.0</div>,
        bgColor: "bg-yellow-600",
      },
    ],
  };

  const router = useRouter();
  const [height, setHeight] = useState(0);
  const [profile, setProfile] = useState<IProfile>();

  const { getProfile } = useAuthAction();

  const load = async () => {
    const data = await getProfile();
    setProfile(data.data.data);
  };

  useEffect(() => {
    setHeight(document?.documentElement?.offsetHeight - 200);
    load();
  }, []);

  return (
    <Layout title="User">
      <div
        className="flex flex-col gap-y-4 overflow-x-scroll"
        style={{ height: height }}
      >
        <Card onClick={() => router.push(`/${props.locale}/profiles`)}>
          <div className="grid grid-cols-2 gap-4 py-2.5">
            <div>
              <p className="text-lg font-semibold">{profile?.name}</p>
              <p className="text-sm text-gray-500">{profile?.email}</p>
            </div>
            <div className="flex justify-end items-center">
              <UserIcon className="w-10 h-10 text-gray-400" />
            </div>
          </div>
        </Card>
        <ul>
          {Object.keys(menus).map((key) => (
            <div className="flex flex-col gap-y-4" key={key}>
              <p className="text-lg font-semibold mt-4">{key}</p>
              {menus[key].map((menu: any, index: number) => (
                <CardList
                  key={index}
                  title={menu.name}
                  details={[menu.description]}
                  icon={menu.icon}
                  bgColor={menu.bgColor}
                  onClick={
                    menu.href
                      ? () => {
                          router.push(menu.href);
                        }
                      : menu.onClick
                  }
                />
              ))}
            </div>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
