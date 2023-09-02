interface IHeroIcons {
  icon: string;
}

export const HeroIcons = (props: IHeroIcons) => {
  return <props.icon />;
};
