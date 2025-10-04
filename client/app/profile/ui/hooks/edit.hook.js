import { useState, useContext, useTransition, useMemo } from "react";
import { FetchHTTPProvider, JSONAPIConnector } from "@schorts/shared-kernel";

import CurrentUserContext from "../../../sessions/ui/contexts/current-user-context";

import UserPatcher from "../../../users/application/patch/user-patcher";

const fetchHTTPProvider = new FetchHTTPProvider(() => {
  const token = sessionStorage.getItem("token");

  return token ? `Bearer ${token}` : "";
});
const jSONAPIConnector = new JSONAPIConnector(fetchHTTPProvider);
const userPatcher = new UserPatcher(jSONAPIConnector);

export default function useEdit(onProfileUpdated) {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [loading, startLoading] = useTransition();
  const [company, setCompany] = useState(currentUser.company);
  const [address, setAddress] = useState(currentUser.address);

  const validCompany = useMemo(() => {
    return company.length > 0;
  }, [company]);

  const validAddress = useMemo(() => {
    return address.length > 0;
  }, [address]);

  const validForm = useMemo(() => {
    return validCompany && validAddress;
  }, [validCompany, validAddress]);

  const somethingHasChanged = () => {
    return (
      currentUser.company !== company
      || currentUser.address !== address
    );
  }

  const updateProfile = (event) => {
    event.preventDefault();

    if (!somethingHasChanged()) {
      onProfileUpdated();

      return;
    }

    startLoading(async () => {
      const result = await userPatcher.patch(currentUser.id, company, address);
        
      console.log(result)

      if (result.isSuccess()) {
        setCurrentUser(result.getValue());
        onProfileUpdated();
      }
    });
  };

  return {
    company,
    setCompany,
    address,
    setAddress,
    currentUser,
    loading,
    validForm,
    updateProfile,
  };
}
