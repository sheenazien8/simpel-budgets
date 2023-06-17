const dictionaries: any = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  id: () => import("./dictionaries/id.json").then((m) => m.default),
};

export const getDictionary = (locale: any) => dictionaries[locale]();

export const translate = (lang: string, args: any) => {
    let result = lang;
    Object.keys(args).forEach((key) => {
        result = result.replace(`{${key}}`, args[key]);
    });
    return result;
};

export default function useTranslation() {
}
