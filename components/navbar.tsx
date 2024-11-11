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
import { GithubIcon, Logo } from "@/components/icons";

export const Navbar = () => {
    return (
        <NextUINavbar maxWidth="xl" position="sticky">
            <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
                <NavbarBrand as="li" className="gap-3 max-w-fit">
                    <NextLink
                        className="flex justify-start items-center gap-1"
                        href="/"
                    >
                        <Logo />
                        <p className="font-bold text-inherit">ACME</p>
                    </NextLink>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem className="flex gap-2">
                    <Link
                        isExternal
                        aria-label="Github"
                        href="https://github.com/elibullockpapa/Google3DMapsChallenge"
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