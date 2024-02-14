import Text from "@/components/text";
import styles from "./VotingInfoBox.module.scss";
import Container from "@/components/container/container";
import { displayAmount } from "@/utils/formatting/balances.utils";
import Icon from "@/components/icon/icon";
import { VoteOption } from "@/transactions/gov";
import { useState } from "react";

export function VotingInfoBox({
  isActive,
  percentage,
  amount,
  value,
  isSelected,
  color,
  isHighest,
  onClick,
  borderColor,
}: {
  isActive: boolean;
  percentage: string;
  amount: string;
  value: VoteOption;
  isSelected: boolean;
  color: string;
  isHighest: boolean;
  onClick: () => void;
  borderColor: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const dimmedColor = ""; //this should be 50% of color variable
  const getHoverStyle = () => {
    if (isSelected && isActive) {
      return {
        backgroundColor: color,
        cursor: "pointer",
        opacity: 1,
        border: "1px solid",
        borderColor: borderColor,
        boxShadow: "var(--box-shadow, 3px 3px 0px 0px rgba(17, 17, 17, 0.15))",
      };
    }
    if (isHovered && isActive) {
      return {
        backgroundColor: color,
        cursor: "pointer",
      };
    }

    return {
      border: "1px solid var(--border-stroke-color, #b3b3b3)",
    };
  };

  return (
    <div
      className={styles.proposalInfoVoting}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      onClick={() => {
        onClick();
      }}
      style={getHoverStyle()}
    >
      <div className={styles.votingInfoRow1}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <div>
            <Text font="proto_mono" size="sm">
              {value}
            </Text>
          </div>
        </div>
      </div>
      <Container
        direction="column"
        className={styles.votingInfoRow2}
        width="50%"
        center={{ vertical: true, horizontal: true }}
      >
        <div className={styles.infoRow1First}>
          <Container
            direction="row"
            gap={6}
            center={{
              vertical: true,
            }}
          >
            <Text font="proto_mono" opacity={0.4} size="x-sm">
              {displayAmount(amount, 0, {
                commify: true,
                short: true,
              })}
            </Text>
            <Icon
              icon={{
                url: "/tokens/canto.svg",
                size: 14,
              }}
              themed={true}
            />
          </Container>
        </div>
      </Container>
    </div>
  );
}
