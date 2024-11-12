import {
    Navbar as NextUINavbar,
    NavbarContent,
    NavbarBrand,
    NavbarItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";

import AccountButton from "./accountButton";

import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon } from "@/components/icons";

export const Navbar = () => {
    return (
        <NextUINavbar height="48px" maxWidth="xl" position="sticky">
            <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
                <NavbarBrand as="li" className="gap-3 max-w-fit">
                    <NextLink
                        className="flex justify-start items-center gap-1"
                        href="/"
                    >
                        <p className="text-xl pr">🌍 City Finding Game</p>
                    </NextLink>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem className="flex gap-2">
                    <Link
                        isExternal
                        aria-label="Github"
                        href="https://github.com/elibullockpapa/cityFindingGame"
                    >
                        <GithubIcon className="text-default-500" />
                    </Link>
                    <ThemeSwitch />
                    <AccountButton />
                </NavbarItem>
            </NavbarContent>
        </NextUINavbar>
    );
};
