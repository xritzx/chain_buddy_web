"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { signIn, signOut, getCsrfToken } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import NookUserModal from "~~/components/NookUserModal";
import { useAccount } from "wagmi";
import {
  SignInButton,
  StatusAPIResponse,
  useProfile,
} from "@farcaster/auth-kit";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Chat",
    href: "/chat",
    icon: <ChatBubbleLeftEllipsisIcon className="h-4 w-4" />,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-secondary shadow-md" : ""
              } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any | null>(null);

  const { profile } = useProfile();
  const burgerMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localStorage.getItem('username')) {
      setUsername(localStorage.getItem('username'));
      const uinfo = localStorage.getItem('userInfo');
      if(uinfo) {
        setUserInfo(JSON.parse(uinfo));
      }
    }
  }, []);
  
  useEffect(() => {
    if (username) {
      localStorage.setItem('username', username);
    }
    if (userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
  }, [username]);

  const handleUsernameSubmit = (username: string) => {
    localStorage.setItem('username', username);
    setModalOpen(false);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  return (
    <div className="fixed top-3 lg:static max-w-screen-xl navbar bg-base-100 rounded-xl justify-center z-10 shadow-md shadow-secondary mx-auto mt-5">
      <div className="navbar-center w-auto lg:w-1/2">
      {isModalOpen && (
        <NookUserModal isOpen={isModalOpen} onClose={handleClose} onUsernameSubmit={handleUsernameSubmit} />
      )}
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost "hover:bg-transparent"}`} 
          >
            <Bars3Icon className="h-1/2" />
          </label>
          
        </div>
        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex relative w-10 h-10">
            <Image alt="Catflix logo" className="cursor-pointer" fill src="/logo.svg" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-tight">CatFlix.ai</span>
            <span className="text-xs">For all your visual treats</span>
          </div>
        </Link>
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
          <HeaderMenuLinks />
        </ul>
      </div>
      <div className="navbar-end flex-grow mr-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 relative">
            <img className="rounded-full border border-gray-200 shadow-sm object-cover w-full h-ful" src={profile.pfpUrl ?? userInfo?.image} alt={profile?.displayName ?? userInfo?.name} />
          </div>
          <span className="text-sm font-medium text-gray-400">{profile?.displayName ?? userInfo?.name}</span>
        </div>
        { !username && <SignInButton onSuccess={(res) => {
          setUsername(res.username??'')
          setUserInfo({ name: res.displayName, image: res.pfpUrl})
        }} />}&nbsp;
        <RainbowKitCustomConnectButton />
      </div>
    </div>
  );
};
