import { URL } from 'url';
import IResourceType from './IResourceType';
import IHttpHeaders from './IHttpHeaders';
import OriginType from './OriginType';
import type { IEventSubscriber } from '@ulixee/commons/interfaces/IRegisteredEventListener';

export default interface IHttpResourceLoadDetails {
  id: number;
  isSSL: boolean;
  isUpgrade: boolean;
  isServerHttp2: boolean;
  isHttp2Push: boolean;
  remoteAddress?: string;
  localAddress?: string;
  originType?: OriginType;
  hasUserGesture?: boolean;
  documentUrl?: string;
  isUserNavigation?: boolean;
  isFromRedirect?: boolean;
  previousUrl?: string;
  firstRedirectingUrl?: string; // track back to first redirection
  redirectedToUrl?: string;
  protocol: string;
  dnsResolvedIp?: string;
  url: URL;
  method: string;
  requestTime: number;
  requestOriginalHeaders: IHttpHeaders;
  requestHeaders: IHttpHeaders;
  requestTrailers?: IHttpHeaders;
  requestPostData?: Buffer;
  status?: number;
  originalStatus?: number;
  statusMessage?: string;
  responseUrl?: string;
  responseOriginalHeaders?: IHttpHeaders;
  responseHeaders?: IHttpHeaders;
  responseTime?: number;
  responseTrailers?: IHttpHeaders;
  resourceType?: IResourceType;
  responseBodySize?: number;
  browserRequestId?: string;
  browserFrameId?: number;
  browserHasRequested?: Promise<void>;
  browserServedFromCache?: 'service-worker' | 'disk' | 'prefetch' | 'memory';
  browserLoadedTime?: number;
  browserLoadFailure?: string;
  browserBlockedReason?: string;
  browserCanceled?: boolean;
  events: IEventSubscriber;
}
