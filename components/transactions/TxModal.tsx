import { useState, useEffect } from "react";
import Modal from "../modal/modal";
import Button from "../button/button";
import Icon from "../icon/icon";
import TxFlow from "./TxFlow";
import Container from "../container/container";
import Text from "../text";
import styles from "./transactions.module.scss";
import Spacer from "../layout/spacer";
import clsx from "clsx";
import StatusIcon from "../icon/statusIcon";
import Splash from "../splash/splash";
import { dateToMomentsAgo } from "@/utils/formatting";
import useCantoSigner from "@/hooks/helpers/useCantoSigner";
import Analytics from "@/provider/analytics";
import { TransactionFlow } from "@/transactions/flows";
import { useToast } from "@/components/toast";

const TransactionModal = () => {
  // set modal open state
  const [isOpen, setIsOpen] = useState(false);
  // state for current selected flow
  const [currentFlowId, setCurrentFlowId] = useState<string | null>(null);

  // connected signer
  const { signer, txStore } = useCantoSigner();
  // toast notifications for txs
  const toast = useToast();

  // get transaction flows for user
  const transactionFlows = txStore?.getUserTransactionFlows(
    signer?.account.address ?? ""
  );

  function getFlowFromId(id: string) {
    return transactionFlows?.find((flow) => flow.id === id);
  }

  // open if transaction is loading in
  useEffect(() => {
    let currFlow: TransactionFlow | undefined;
    if (transactionFlows) {
      transactionFlows.forEach((flow) => {
        if (flow.status === "POPULATING" && !currFlow) {
          currFlow = flow;
        } else if (
          flow.inProgress &&
          (flow.status === "SUCCESS" || flow.status === "ERROR")
        ) {
          toast.add({
            toastID: new Date().getTime().toString(),
            primary: `${flow.title} ${
              flow.status === "SUCCESS" ? "successful" : "failed"
            }`,
            state: flow.status === "SUCCESS" ? "success" : "failure",
            duration: 5000,
          });
          txStore?.updateTxFlow(signer?.account.address ?? "", flow.id, {
            inProgress: false,
          });
        }
      });

      if (currFlow) {
        setIsOpen(true);
        setCurrentFlowId(currFlow.id);
        // close bridge/lp/lm confirmation modals
        if (currFlow?.onSuccessCallback) {
          currFlow.onSuccessCallback();
        }
      }
    }
  }, [transactionFlows]);

  return (
    <>
      <Modal
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        height="36rem"
        width="32rem"
        closeOnOverlayClick
      >
        <Text size="lg">Activity</Text>
        {transactionFlows == undefined ||
        (transactionFlows.length > 0 &&
          transactionFlows[transactionFlows.length - 1].status ==
            "POPULATING") ? (
          <Container
            height="calc(100% - 30px)"
            center={{
              vertical: true,
              horizontal: true,
            }}
          >
            <Container height="300px">
              <Splash height="300px" width="300px" themed />
            </Container>
            <Text size="lg" font="macan-font">
              loading...
            </Text>
          </Container>
        ) : transactionFlows && transactionFlows?.length > 0 ? (
          <div className={styles.modalClip}>
            <div className={styles["scroll-view"]}>
              {/* <Spacer height="10px" /> */}
              <div className={clsx(styles["items-list"])}>
                {transactionFlows
                  .sort((a, b) => Number(b.id) - Number(a.id))
                  .map((flow, idx) => (
                    <Container
                      key={idx}
                      width="100%"
                      direction="row"
                      gap={20}
                      center={{
                        vertical: true,
                      }}
                      className={styles.item}
                      onClick={() => {
                        setCurrentFlowId(flow.id);
                      }}
                    >
                      <div className={styles.txImg}>
                        <StatusIcon status={flow.status} size={24} />
                      </div>
                      <Container>
                        <Text size="sm">{flow.title}</Text>
                        <Text theme="secondary-dark" size="x-sm">
                          {dateToMomentsAgo(flow.createdAt)}
                        </Text>
                      </Container>
                      <div
                        style={{
                          transform: !(flow.id === currentFlowId)
                            ? "rotate(-90deg)"
                            : "rotate(0deg)",
                        }}
                      >
                        <Icon
                          themed
                          style={{ filter: "invert(var(--dark-mode))" }}
                          icon={{
                            url: "/dropdown.svg",
                            size: 24,
                          }}
                        />
                      </div>
                    </Container>
                  ))}
                <Spacer height="100%" />

                <Container
                  width="100%"
                  center={{
                    vertical: true,
                  }}
                >
                  <Button
                    width={"fill"}
                    color="secondary"
                    height={"small"}
                    fontFamily="macan-font"
                    onClick={() =>
                      txStore?.clearTransactions(signer?.account.address ?? "")
                    }
                  >
                    CLEAR ALL TXS
                  </Button>
                  <Spacer height="10px" />
                </Container>
              </div>
            </div>
            <Container
              className={clsx(styles["grp-items"])}
              style={{
                transform: currentFlowId ? "translateX(0)" : "translateX(100%)",
              }}
            >
              <div>
                <Container
                  direction="row"
                  gap={20}
                  className={styles.item}
                  width="120px"
                  height="50px"
                  center={{
                    vertical: true,
                  }}
                  onClick={() => {
                    setCurrentFlowId(null);
                  }}
                >
                  <div
                    style={{
                      transform: "rotate(90deg)",
                    }}
                  >
                    <Icon
                      themed
                      style={{ filter: "invert(var(--dark-mode))" }}
                      icon={{
                        url: "/dropdown.svg",
                        size: 24,
                      }}
                    />
                  </div>
                  <Text size="sm" font="macan-font">
                    Back
                  </Text>
                </Container>
              </div>
              {currentFlowId && getFlowFromId(currentFlowId) && (
                <TxFlow
                  txFlow={getFlowFromId(currentFlowId)}
                  onRetry={() => {
                    txStore?.performFlow(
                      signer?.account.address ?? "",
                      currentFlowId
                    );
                  }}
                  setBridgeStatus={(txIndex, status) =>
                    txStore?.setTxBridgeStatus(
                      signer?.account.address ?? "",
                      currentFlowId,
                      txIndex,
                      {
                        lastStatus: status.status,
                        timeLeft: status.completedIn,
                      }
                    )
                  }
                  closeModal={() => setIsOpen(false)}
                />
              )}
            </Container>
          </div>
        ) : (
          <Container
            height="calc(100% - 30px)"
            center={{
              vertical: true,
              horizontal: true,
            }}
          >
            <Text size="lg" font="macan-font">
              no recent transactions
            </Text>
          </Container>
        )}
      </Modal>
      <Button
        color="white"
        minimal
        height={25}
        fontSize="sm"
        onClick={() => {
          Analytics.actions.events.transactionModalOpened();
          setIsOpen(true);
        }}
      >
        Activity
      </Button>
    </>
  );
};

export default TransactionModal;
