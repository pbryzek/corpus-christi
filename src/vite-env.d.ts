/// <reference types="vite/client" />

type MpWidgetProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
  customcss?: string;
};

declare namespace JSX {
  interface IntrinsicElements {
    'mpp-user-login': MpWidgetProps;
    'mpp-my-giving': MpWidgetProps & { hidesoftcredits?: string };
    'mpp-my-pledges': MpWidgetProps & { hidecancelbuttonpledge?: string };
    'mpp-pledge-campaign': MpWidgetProps & {
      pledgecampaignid?: string;
      pledgeemailtemplate?: string;
      suggestedamounts?: string;
    };
  }
}
