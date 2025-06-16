// Needed on some sites for scripts to set .innerHTML of things.
const overwrite_default = true;
const passThroughFunc = (string) => string;
const TTPName = "passthrough";
let TTP_default,
  TTP = {
    createHTML: passThroughFunc,
    createScript: passThroughFunc,
    createScriptURL: passThroughFunc,
  };
let needsTrustedHTML = false;

const doit = () => {
  try {
    if (
      typeof window.isSecureContext !== "undefined" &&
      window.isSecureContext
    ) {
      if (window.trustedTypes && window.trustedTypes.createPolicy) {
        needsTrustedHTML = true;
        if (trustedTypes.defaultPolicy) {
          log("TT Default Policy exists");
          if (overwrite_default)
            TTP = window.trustedTypes.createPolicy("default", TTP);
          else TTP = window.trustedTypes.createPolicy(TTPName, TTP);
          TTP_default = trustedTypes.defaultPolicy;
          log(
            `Created custom passthrough policy, in case the default policy is too restrictive: Use Policy '${TTPName}' in var 'TTP':`,
            TTP,
          );
        } else {
          TTP_default = TTP = window.trustedTypes.createPolicy("default", TTP);
        }
        log("Trusted-Type Policies: TTP:", TTP, "TTP_default:", TTP_default);
      }
    }
  } catch (e) {
    log(e);
  }
};

const log = (...args) => {
  console.log(...args);
};

doit();
