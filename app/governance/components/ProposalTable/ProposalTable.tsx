"use client";
import React, { useMemo, useState } from "react";
import styles from "./ProposalTable.module.scss";
import { Proposal } from "@/hooks/gov/interfaces/proposal";
import {
  formatProposalStatus,
  formatProposalType,
} from "@/utils/gov/formatData";
import Text from "@/components/text";
import { useRouter } from "next/navigation";
import ToggleGroup from "@/components/groupToggle/ToggleGroup";
import Table from "@/components/table/table";
import Container from "@/components/container/container";
import { Pagination } from "@/components/pagination/Pagination";
import Spacer from "@/components/layout/spacer";
import Icon from "@/components/icon/icon";

interface TableProps {
  proposals: Proposal[];
}

const PAGE_SIZE = 10;
enum ProposalFilter {
  ALL = "ALL PROPOSALS",
  PASSED = "PASSED PROPOSALS",
  REJECTED = "REJECTED PROPOSALS",
}

const ProposalTable = ({ proposals }: TableProps) => {
  // route to proposal page
  const router = useRouter();
  const handleRowClick = (proposalId: any) => {
    // Navigate to the appropriate page
    router.push(`/governance/proposal?id=${proposalId}`);
  };

  // filter proposals
  const [currentFilter, setCurrentFilter] = useState<ProposalFilter>(
    ProposalFilter.ALL
  );
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProposals = useMemo(() => {
    setCurrentPage(1);
    return proposals.filter((proposal) => {
      switch (currentFilter) {
        case ProposalFilter.PASSED:
          return proposal.status === "PROPOSAL_STATUS_PASSED";
        case ProposalFilter.REJECTED:
          return proposal.status === "PROPOSAL_STATUS_REJECTED";
        default:
          return true;
      }
    });
  }, [currentFilter, proposals]);

  const activeProposals = useMemo(() => {
    setCurrentPage(1);
    return proposals.filter((proposal) => {
      return proposal.status === "PROPOSAL_STATUS_VOTING_PERIOD";
    });
  }, [proposals]);

  const totalPages = useMemo(
    () => Math.ceil(filteredProposals.length / PAGE_SIZE),
    [filteredProposals.length]
  );

  const paginatedProposals = filteredProposals.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  if (proposals.length == 0) {
    return (
      <div>
        <Text font="proto_mono">Loading Proposals...</Text>
      </div>
    );
  }
  return (
    <div className={styles.tableContainer}>
      {activeProposals.length > 0 ? (
        <div className={styles.table}>
          {
            <Table
              title={currentFilter}
              secondary={
                <Container width="400px">
                  <ToggleGroup
                    options={Object.values(ProposalFilter).map(
                      (filter) => filter.split(" ")[0]
                    )}
                    selected={currentFilter.split(" ")[0]}
                    setSelected={(value) => {
                      const proposalFilter = Object.values(ProposalFilter).find(
                        (filter) => filter.split(" ")[0] === value
                      );
                      setCurrentFilter(proposalFilter || ProposalFilter.ALL);
                    }}
                  />
                </Container>
              }
              headers={
                filteredProposals.length != 0 || filteredProposals
                  ? [
                      {
                        value: (
                          <Text opacity={0.4} font="rm_mono">
                            ID
                          </Text>
                        ),
                        ratio: 2,
                      },
                      { value: <Text opacity={0.4}>Title</Text>, ratio: 6 },
                      {
                        value: (
                          <Text opacity={0.4} font="rm_mono">
                            Status
                          </Text>
                        ),
                        ratio: 3,
                      },
                      {
                        value: (
                          <Text opacity={0.4} font="rm_mono">
                            Type
                          </Text>
                        ),
                        ratio: 5,
                      },
                      {
                        value: (
                          <Text opacity={0.4} font="rm_mono">
                            Voting Date
                          </Text>
                        ),
                        ratio: 4,
                      },
                    ]
                  : []
              }
              content={[
                ...activeProposals.map((proposal, index) => {
                  return (
                    <div
                      key={`row_${index}${proposal.proposal_id}`}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        cursor: "pointer",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "80px",
                      }}
                      onClick={() => handleRowClick(proposal.proposal_id)}
                    >
                      <Container
                        width="10%"
                        key={`name_${index}`}
                        style={{
                          cursor: "pointer",
                          alignItems: "center",
                        }}
                      >
                        <Text font="rm_mono" className={styles.tableData}>
                          {proposal.proposal_id}
                        </Text>
                      </Container>
                      <Container
                        width="30%"
                        key={`tokens_${index}`}
                        style={{ cursor: "pointer" }}
                        //direction="row"
                        className={styles.tableTitleColumn}

                        //gap="auto"
                      >
                        <Text
                          font="rm_mono"
                          size="sm"
                          className={styles.rowTitle}
                        >
                          {proposal.title}
                        </Text>
                      </Container>
                      <Container
                        width="15%"
                        key={`commission_${index}`}
                        style={{
                          cursor: "pointer",
                          alignItems: "center",
                        }}
                      >
                        <Text font="rm_mono" className={styles.tableData}>
                          {formatProposalStatus(proposal.status)}
                        </Text>
                      </Container>
                      <Container
                        width="25%"
                        key={`participation_${index}`}
                        style={{
                          cursor: "pointer",
                          alignItems: "center",
                        }}
                      >
                        <Text font="rm_mono" className={styles.tableData}>
                          {formatProposalType(proposal.type_url)}
                        </Text>
                      </Container>
                      <Container
                        width="20%"
                        key={`delegators_${index}`}
                        style={{
                          cursor: "pointer",
                          alignItems: "center",
                        }}
                      >
                        <Text font="rm_mono" className={styles.tableData}>
                          {new Date(proposal.voting_end_time).toDateString()}
                        </Text>
                      </Container>
                    </div>
                  );
                }),
                <Pagination
                  key="pagination"
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handlePageClick={(index) => setCurrentPage(index)}
                />,
              ]}
              isPaginated={true}
            />
          }
        </div>
      ) : (
        <div className={styles.noActiveProposalContainer}>
          <Text font="rm_mono">
            There are no active proposals currently, you’ll find them here if
            any
          </Text>
        </div>
      )}
      <div>
        <Spacer height="30px" />
      </div>
      <div className={styles.table}>
        {
          <Table
            title={currentFilter}
            secondary={
              <Container width="400px">
                <ToggleGroup
                  options={Object.values(ProposalFilter).map(
                    (filter) => filter.split(" ")[0]
                  )}
                  selected={currentFilter.split(" ")[0]}
                  setSelected={(value) => {
                    const proposalFilter = Object.values(ProposalFilter).find(
                      (filter) => filter.split(" ")[0] === value
                    );
                    setCurrentFilter(proposalFilter || ProposalFilter.ALL);
                  }}
                />
              </Container>
            }
            headers={
              filteredProposals.length != 0 || filteredProposals
                ? [
                    {
                      value: <div></div>,
                      ratio: 4,
                    },
                    {
                      value: <div></div>,
                      ratio: 2,
                    },

                    {
                      value: <div></div>,
                      ratio: 3,
                    },
                    {
                      value: <div></div>,
                      ratio: 1,
                    },
                  ]
                : []
            }
            isGovTable={true}
            content={
              paginatedProposals.length > 0
                ? [
                    ...paginatedProposals.map((proposal, index) => {
                      return (
                        <div
                          key={`row_${index}${proposal.proposal_id}`}
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            cursor: "pointer",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "80px",
                          }}
                          onClick={() => handleRowClick(proposal.proposal_id)}
                        >
                          <Container
                            direction="column"
                            width="40%"
                            key={`name_${index}`}
                            style={{ cursor: "pointer", alignItems: "center" }}
                          >
                            <Container
                              direction="row"
                              style={{
                                justifyContent: "flex-start",
                                width: "100%",
                                paddingLeft: "10px",
                                marginBottom: "20px",
                                opacity: 0.4,
                              }}
                            >
                              <Container
                                style={{
                                  alignItems: "center",
                                  marginLeft: "10px",
                                  paddingRight: "40px",
                                  borderRight: "2px solid",
                                }}
                              >
                                <Text
                                  font="rm_mono"
                                  className={styles.tableData}
                                >
                                  {proposal.proposal_id}
                                </Text>
                              </Container>
                              <Container
                                key={`type_${index}`}
                                style={{
                                  cursor: "pointer",
                                  alignItems: "center",
                                  marginLeft: "40px",
                                }}
                              >
                                <Text
                                  font="rm_mono"
                                  className={styles.tableData}
                                >
                                  {formatProposalType(proposal.type_url)}
                                </Text>
                              </Container>
                            </Container>
                            <Container
                              key={`title_${index}`}
                              style={{ cursor: "pointer" }}
                              //direction="row"
                              className={styles.tableTitleColumn}

                              //gap="auto"
                            >
                              <div className={styles.rowTitle}>
                                <Text font="rm_mono" size="sm">
                                  {proposal.title}
                                </Text>
                              </div>
                            </Container>
                          </Container>

                          <Container
                            direction="column"
                            width="20%"
                            key={`status_${index}`}
                            style={{ cursor: "pointer", alignItems: "center" }}
                          >
                            <Container
                              direction="row"
                              width="100%"
                              style={{
                                marginBottom: "10px",
                                justifyContent: "flex-start",
                              }}
                            >
                              <Text opacity={0.4}>Status</Text>
                            </Container>
                            <Container
                              direction="row"
                              className={styles.proposalStatus}
                            >
                              <div className={styles.circleContainer}>
                                <div
                                  className={styles.circle}
                                  style={{
                                    backgroundColor:
                                      proposal.status ==
                                      "PROPOSAL_STATUS_PASSED"
                                        ? "#01BD09"
                                        : "#EF4444",
                                  }}
                                />
                              </div>
                              <Text font="rm_mono" className={styles.tableData}>
                                {formatProposalStatus(proposal.status)}
                              </Text>
                            </Container>
                          </Container>

                          <Container
                            width="30%"
                            key={`votingdate_${index}`}
                            style={{ cursor: "pointer", alignItems: "center" }}
                          >
                            <Text font="rm_mono" className={styles.tableData}>
                              {new Date(
                                proposal.voting_end_time
                              ).toDateString()}
                            </Text>
                          </Container>
                          <Container
                            width="10%"
                            key={`votingdate_${index}`}
                            style={{ cursor: "pointer", alignItems: "center" }}
                          >
                            <div className={styles.backButton}>
                              <Icon
                                icon={{
                                  url: "/dropdown.svg",
                                  size: 22,
                                }}
                                themed
                              />
                            </div>
                          </Container>
                        </div>
                      );
                    }),
                    <Pagination
                      key="pagination"
                      currentPage={currentPage}
                      totalPages={totalPages}
                      handlePageClick={(index) => setCurrentPage(index)}
                    />,
                  ]
                : [
                    <div key="noData" className={styles.noProposalContainer}>
                      <Text font="proto_mono" size="lg">
                        NO {currentFilter} FOUND
                      </Text>
                    </div>,
                  ]
            }
            isPaginated={true}
          />
        }
      </div>
    </div>
  );
};

export default ProposalTable;
