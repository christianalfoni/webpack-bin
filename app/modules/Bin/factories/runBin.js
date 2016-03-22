import set from 'cerebral-addons/set';
import copy from 'cerebral-addons/copy';
import when from 'cerebral-addons/when';
import postCode from '../actions/postCode';
import httpGet from 'cerebral-module-http/get';
import showSnackbar from './showSnackbar';
import hideSnackbar from '../actions/hideSnackbar';
import redirectToBin from '../actions/redirectToBin';
import switchCodeResponse from '../actions/switchCodeResponse';
import requestBinUpdate from '../../Live/actions/requestBinUpdate';
import whenErrorIs from '../actions/whenErrorIs';
import resetBin from '../chains/resetBin';
import checkVendorsBundleFetchStatus from '../actions/checkVendorsBundleFetchStatus';

export default [
  set('state:/bin.isRunning', true),
  when('state:/live.hasJoined'), {
    isTrue: [
      requestBinUpdate
    ],
    isFalse: [
      set('state:/bin.isLoadingBin', true),
      postCode, {
        success: [
          switchCodeResponse, {
            isNewBin: [
              copy('input:/result', 'state:/bin.currentBin'),
              showSnackbar('Created your personal bin, have fun!', true),
              ...resetBin,
              redirectToBin
            ],
            isFetchingVendorsBundle: [
              set('state:/bin.isFetchingVendorsBundle', true),
              set('state:/bin.showLoadingBin', true),
              hideSnackbar,
              checkVendorsBundleFetchStatus, {
                success: [
                  showSnackbar('Vendors bundle fetched successfully'),
                  set('state:/bin.isFetchingVendorsBundle', false),
                  set('state:/bin.showLoadingBin', false),
                  postCode, {
                    success: [
                      hideSnackbar,
                      ...resetBin
                    ],
                    error: [
                      set('state:/bin.showInfo', true),
                      set('state:/bin.highlightCreateIssue', true),
                      showSnackbar('Something went wrong after adding your package, please report error', true),
                      set('state:/bin.showLoadingBin', false)
                    ]
                  }
                ],
                error: [
                  showSnackbar('Unable to fetch the vendors bundle, sorry!'),
                  set('state:/bin.isFetchingVendorsBundle', false),
                  set('state:/bin.showLoadingBin', false)
                ]
              }
            ],
            otherwise: [
              hideSnackbar,
              ...resetBin
            ]
          }
        ],
        error: [
          whenErrorIs, {
            'PACKAGE_EXTRACTOR_DOWN': [
              set('state:/bin.showInfo', true),
              set('state:/bin.highlightCreateIssue', true),
              showSnackbar('NPM package extractor is down, please report', true),
              set('state:/bin.showLoadingBin', false)
            ],
            'PACKAGE_EXTRACTOR_RUNNING': [
              showSnackbar('Packages already being extracted from NPM, try again in a few seconds...', true),
              set('state:/bin.showLoadingBin', false)
            ],
            otherwise: [
              set('state:/bin.showInfo', true),
              set('state:/bin.highlightCreateIssue', true),
              showSnackbar('An error occured, please report what you tried to do!', true),
              set('state:/bin.showLoadingBin', false)
            ]
          }
        ]
      }
    ]
  }
];
