"use client";
import Link from "next/link";
import styles from "./navbar.module.scss";
import Text from "../text";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { clsx } from "clsx";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import TransactionModal from "../transactions/TxModal";
import ThemeButton from "../footer/components/footerButton";
import { useEffect, useRef, useState } from "react";
import Analytics from "@/provider/analytics";
import useCantoSigner from "@/hooks/helpers/useCantoSigner";
import { useAccount, useBalance } from "wagmi";
import { useAutoConnect } from "@/provider/useAutoConnect";
import Icon from "../icon/icon";
import { SlWallet } from "react-icons/sl";
import useScreenSize from "@/hooks/helpers/useScreenSize";
import { HiddenWalletConnect } from "../wallet_connect/walletConnect";
import { useChain } from "@cosmos-kit/react";
const NavBar = () => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  // This is used to connect safe as wallet,
  // if the app is opened in the safe context.
  useAutoConnect();
  const { isMobile } = useScreenSize();
  const currentPath = usePathname();
  const searchParams = useSearchParams();
  const { isConnected } = useAccount();
  const { isWalletConnected } = useChain("althea");
  const { signer } = useCantoSigner();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // useEffect(() => {
  //   if (signer?.account.address) {
  //     Analytics.actions.people.registerWallet(signer.account.address);
  //     Analytics.actions.identify(signer.account.address, {
  //       account: signer.account.address,
  //     });
  //     Analytics.actions.events.connections.walletConnect(true);
  //   }
  // }, [signer]);

  useEffect(() => {
    let url = window.origin + currentPath;
    if (searchParams.toString()) {
      url += `?${searchParams.toString()}`;
    }
    if (currentPath == "/bridge") {
      Analytics.actions.events.pageOpened("bridge", url);
    } else if (currentPath == "/lending") {
      Analytics.actions.events.pageOpened("lending", url);
    } else if (currentPath == "/lp") {
      Analytics.actions.events.pageOpened("lp interface", url);
    } else if (currentPath == "/explore") {
      Analytics.actions.events.pageOpened("explore", url);
    } else if (currentPath == "/staking") {
      Analytics.actions.events.pageOpened("staking", url);
    } else if (currentPath == "/governance") {
      Analytics.actions.events.pageOpened("governance", url);
    } else {
      Analytics.actions.events.pageOpened("home", url);
    }
    isMenuOpen && setIsMenuOpen(false);
  }, [currentPath, searchParams]);
  // const balance = useBalance({
  //   address: signer?.account.address,
  //   watch: true,
  //   chainId: signer?.chain.id,
  // });

  const handleWalletIconClick = () => {
    if (isConnected || isWalletConnected) {
      setIsAccountModalOpen(true);
    } else {
      setIsWalletModalOpen(true);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.logo}>
          <button
            className={styles.menu}
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <Icon
              icon={{
                url: "/menu.svg",
                size: 56,
              }}
              themed
            />
          </button>
          <Link href="/">
            <Image src="/altheaLink.svg" width={160} height={24} alt="althea" />
          </Link>
        </div>

        <div className={styles["nav-links"]} data-menu-open={isMenuOpen}>
          {/* <Link
          href="/bridge"
          className={clsx(
            styles["nav-link"],
            currentPath == "/bridge" && styles.active
          )}
          onClick={() => Analytics.actions.events.clickedNavLink("Bridge")}
        >
          <Text size="sm">Bridge</Text>
        </Link> */}

          {/* <Link
          href="/lending"
          className={clsx(
            styles["nav-link"],
            currentPath == "/lending" && styles.active
          )}
          onClick={() => Analytics.actions.events.clickedNavLink("Lending")}
        >
          <Text size="sm">Lending</Text>
        </Link> */}
          {/* <Link
          href="/lp"
          className={clsx(
            styles["nav-link"],
            currentPath == "/lp" && styles.active
          )}
          onClick={() => Analytics.actions.events.clickedNavLink("Pools")}
        >
          <Text size="sm">Pools</Text>
        </Link> */}
          {/* <Link
          href="/explore"
          className={clsx(
            styles["nav-link"],
            currentPath == "/explore" && styles.active
          )}
          onClick={() => Analytics.actions.events.clickedNavLink("Explore")}
        >
          <Text size="sm">Explore</Text>
        </Link> */}
          <Link
            href="/staking"
            className={clsx(
              styles["nav-link"],
              currentPath == "/staking" && styles.active
            )}
            onClick={() => Analytics.actions.events.clickedNavLink("Staking")}
          >
            <Text size="sm">Staking</Text>
          </Link>
          <Link
            href="/governance"
            className={clsx(
              styles["nav-link"],
              currentPath.includes("governance") && styles.active
            )}
            onClick={() =>
              Analytics.actions.events.clickedNavLink("Governance")
            }
          >
            <Text size="sm">Governance</Text>
          </Link>

          {/*  <div
          className={styles.moreLink}
          onMouseEnter={() => setIsMoreModalOpen(true)}
          onMouseLeave={() => setIsMoreModalOpen(false)}
        >
          <div className={styles.moreButtonContainer}>
            <Text size="sm">More</Text>
            <div className={styles.dropdown}>
              <Icon
                icon={{
                  url: "/dropdown.svg",
                  size: 16,
                }}
                themed
              />
            </div>
          </div>
          {isMoreModalOpen && (
            <div className={styles.popUp}>
              {
                <Link
                  href="/staking"
                  className={clsx(styles["dropdownlink"])}
                  onClick={() => {
                    setIsMoreModalOpen(false);
                    Analytics.actions.events.clickedNavLink("Staking");
                  }}
                >
                  <div>
                    <Text size="sm">Staking</Text>
                  </div>
                </Link>
              }
              {
                <Link
                  href="/governance"
                  className={clsx(styles["dropdownlink"])}
                  onClick={() => {
                    setIsMoreModalOpen(false);
                    Analytics.actions.events.clickedNavLink("Governance");
                  }}
                  style={{ borderBottom: "none" }}
                >
                  <div>
                    <Text size="sm">Governance</Text>
                  </div>
                </Link>
              }
            </div>
          )}
        </div> */}
        </div>
        <div className={styles["btn-grp"]}>
          {/* <div className={styles.theme}>
          <ThemeButton />
        </div> */}
          <div className={styles.activity}>
            {isMobile && (
              <SlWallet
                className={styles.wallet_icon}
                onClick={handleWalletIconClick}
              />
            )}
            <TransactionModal />
          </div>

          {/* <div className={styles["wallet-connect"]}>
          <ConnectButton key={balance.data?.formatted} chainStatus={"none"} />
        </div> */}
          {/* <WalletWizardModal
          isOpen={isWalletWizardOpen}
          onOpen={setIsWalletWizardOpen}
          balance={balance}
        /> */}
        </div>
      </div>
      <HiddenWalletConnect
        setIsOpen={setIsWalletModalOpen}
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        setIsAccountOpen={setIsAccountModalOpen}
        isAccountOpen={isAccountModalOpen}
        onAccountClose={() => setIsAccountModalOpen(false)}
      />
    </>
  );
};

export default NavBar;
