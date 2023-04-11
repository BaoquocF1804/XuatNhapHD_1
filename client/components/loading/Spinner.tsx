import styled from "styled-components";

const StyledSpinner = styled.div`
  border: 1px solid white;
  border-left: 1px solid transparent;
  width: 10px;
  height: 10px;
  border-radius: 100%;
`;
const Spinner = () => {
  return <StyledSpinner className="animate-spin"></StyledSpinner>;
};

export default Spinner;
