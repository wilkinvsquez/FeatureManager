export const SHOWCASE_ASSET = {
    "serviceId": "MOBILE_APP",
    "hasDynamicCatalogs": true,
    "hidden": false,
    "document": {
        "style": {
            "layout": {
                "type": "column",
                "columns": 2
            }
        },
        "type": "collapsible",
        "title": "Mobile App",
        "content": [
            {
                "type": "container",
                "style": {
                    "layout": {
                        "type": "row",
                        "columns": 2,
                        "justifyContent": "space-between"
                    }
                },
                "components": [
                    {
                        "type": "toggleButton",
                        "title": "",
                        "states": [
                            "edit",
                            "cancel"
                        ],
                        "nodeName": "moduleStatus",
                        "onClick": "moduleStatus",
                        "btnType": "outlined",
                        "metadata": {
                            "module": "MOBILE_APP",
                            "belongTo": ""
                        }
                    },
                    {
                        "type": "toogleReference",
                        "title": "*Nomenclature toggle reference:"
                    }
                ]
            },
            {
                "type": "container",
                "style": {
                    "layout": {
                        "type": "grid",
                        "columns": 2
                    }
                },
                "components": [
                    {
                        "type": "card",
                        "module": "MOBILE_APP",
                        "keyname": "appVersionConfiguration",
                        "hasFlatValue": false,
                        "title": "Mobile App Version Update",
                        "description": "Forces or suggests app updates based on version and frequency settings.",
                        "components": [
                            {
                                "type": "container",
                                "style": {
                                    "layout": {
                                        "type": "row",
                                        "columns": 2
                                    }
                                },
                                "components": [
                                    {
                                        "type": "dropdown",
                                        "title": "Mobile App Version",
                                        "keyId": "version",
                                        "nodeName": "AVC-dp_qhaavf4CU28HWc9o1qBxWx",
                                        "hasCatalog": true,
                                        "catalogId": "682f9dc46f93eb21d24d75c9",
                                        "options": [],
                                        "value": "3.1.0",
                                        "metadata": {
                                            "module": "MOBILE_APP",
                                            "belongTo": "appVersionConfiguration"
                                        }
                                    },
                                    {
                                        "type": "dropdown",
                                        "title": "Frequency Request",
                                        "keyId": "time",
                                        "nodeName": "AVC-dp_dp_qhaavf4CU28HWc9o1qBxWx",
                                        "options": [
                                            {
                                                "display": "1 minute",
                                                "value": 1
                                            },
                                            {
                                                "display": "5 minutes",
                                                "value": 5
                                            },
                                            {
                                                "display": "30 minutes",
                                                "value": 30
                                            },
                                            {
                                                "display": "1 day",
                                                "value": 1440
                                            }
                                        ],
                                        "value": 1,
                                        "metadata": {
                                            "module": "MOBILE_APP",
                                            "belongTo": "appVersionConfiguration"
                                        }
                                    }
                                ]
                            },
                            {
                                "type": "container",
                                "style": {
                                    "layout": {
                                        "type": "grid",
                                        "column": 2
                                    }
                                },
                                "components": [
                                    {
                                        "type": "radioGroup",
                                        "title": "",
                                        "keyId": "forced",
                                        "nodeName": "AVC-rg_mXJiAfjGAHBFUYeydRh3w9",
                                        "options": [
                                            {
                                                "id": "force_update_radio_input",
                                                "label": "Force Update",
                                                "value": true
                                            },
                                            {
                                                "id": "optional_update_radio_input",
                                                "label": "Optional Update",
                                                "value": false
                                            }
                                        ],
                                        "value": false,
                                        "metadata": {
                                            "module": "MOBILE_APP",
                                            "belongTo": "appVersionConfiguration"
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "card",
                        "module": "MOBILE_APP",
                        "keyname": "closeAllSessions",
                        "hasFlatValue": false,
                        "title": "Close All Sessions",
                        "description": "*Closes all active user sessions at a scheduled day and time.",
                        "components": [
                            {
                                "type": "container",
                                "style": {
                                    "layout": {
                                        "type": "grid",
                                        "columns": 2
                                    }
                                },
                                "components": [
                                    {
                                        "type": "checkBox",
                                        "title": "Enable Flag Verification",
                                        "keyId": "enabled",
                                        "nodeName": "CAS-tg_mtj5VK4pV4yH4EGWBtAtcG",
                                        "value": true,
                                        "metadata": {
                                            "module": "MOBILE_APP",
                                            "belongTo": "closeAllSessions",
                                            "showTitle": true,
                                            "positionTitle": "right"
                                        }
                                    },
                                    {
                                        "type": "dropdownDatePicker",
                                        "title": "Date",
                                        "keyId": "not_before",
                                        "nodeName": "CAS-d_mtj5VK4pV4yH4EGWBtAtcG",
                                        "value": "2025-09-13T06:00:00.000Z",
                                        "calendarCurrent": true,
                                        "metadata": {
                                            "module": "MOBILE_APP",
                                            "belongTo": "closeAllSessions"
                                        }
                                    }
                                ]
                            },
                            {
                                "type": "containerCollapsible",
                                "title": "Countries",
                                "description": "*Select the countries where you want to close sessions.",
                                "style": {
                                    "layout": {}
                                },
                                "components": [
                                    {
                                        "type": "toogle",
                                        "title": "Aruba",
                                        "keyId": "aw",
                                        "nodeName": "CAS-aw-tg_mtj5VK4pV4yH4EGWBtAtcG",
                                        "value": true,
                                        "metadata": {
                                            "module": "MOBILE_APP",
                                            "belongTo": "closeAllSessions",
                                            "showTitle": true,
                                            "positionTitle": "right"
                                        }
                                    },
                                    {
                                        "type": "toogle",
                                        "title": "Barbados",
                                        "keyId": "bb",
                                        "nodeName": "CAS-bb-tg_mtj5VK4pV4yH4EGWBtAtcG",
                                        "value": true,
                                        "metadata": {
                                            "module": "MOBILE_APP",
                                            "belongTo": "closeAllSessions",
                                            "showTitle": true,
                                            "positionTitle": "right"
                                        }
                                    },
                                    {
                                        "type": "toogle",
                                        "title": "Colombia",
                                        "keyId": "co",
                                        "nodeName": "CAS-co-tg_mtj5VK4pV4yH4EGWBtAtcG",
                                        "value": true,
                                        "metadata": {
                                            "module": "MOBILE_APP",
                                            "belongTo": "closeAllSessions",
                                            "showTitle": true,
                                            "positionTitle": "right"
                                        }
                                    },
                                    {
                                        "type": "toogle",
                                        "title": "Costa Rica",
                                        "keyId": "cr",
                                        "nodeName": "CAS-cr-tg_mtj5VK4pV4yH4EGWBtAtcG",
                                        "value": true,
                                        "metadata": {
                                            "module": "MOBILE_APP",
                                            "belongTo": "closeAllSessions",
                                            "showTitle": true,
                                            "positionTitle": "right"
                                        }
                                    },
                                    {
                                        "type": "toogle",
                                        "title": "Dominican Republic",
                                        "keyId": "do",
                                        "nodeName": "CAS-do-tg_mtj5VK4pV4yH4EGWBtAtcG",
                                        "value": true,
                                        "metadata": {
                                            "module": "MOBILE_APP",
                                            "belongTo": "closeAllSessions",
                                            "showTitle": true,
                                            "positionTitle": "right"
                                        }
                                    },
                                    {
                                        "type": "toogle",
                                        "title": "El Salvador",
                                        "keyId": "sv",
                                        "nodeName": "CAS-sv-tg_mtj5VK4pV4yH4EGWBtAtcG",
                                        "value": true,
                                        "metadata": {
                                            "module": "MOBILE_APP",
                                            "belongTo": "closeAllSessions",
                                            "showTitle": true,
                                            "positionTitle": "right"
                                        }
                                    },
                                    {
                                        "type": "toogle",
                                        "title": "Guatemala",
                                        "keyId": "gt",
                                        "nodeName": "CAS-gt-tg_mtj5VK4pV4yH4EGWBtAtcG",
                                        "value": true,
                                        "metadata": {
                                            "module": "MOBILE_APP",
                                            "belongTo": "closeAllSessions",
                                            "showTitle": true,
                                            "positionTitle": "right"
                                        }
                                    },
                                    {
                                        "type": "toogle",
                                        "title": "Honduras",
                                        "keyId": "hn",
                                        "nodeName": "CAS-hn-tg_mtj5VK4pV4yH4EGWBtAtcG",
                                        "value": true,
                                        "metadata": {
                                            "module": "MOBILE_APP",
                                            "belongTo": "closeAllSessions",
                                            "showTitle": true,
                                            "positionTitle": "right"
                                        }
                                    },
                                    {
                                        "type": "toogle",
                                        "title": "Jamaica",
                                        "keyId": "jm",
                                        "nodeName": "CAS-jm-tg_mtj5VK4pV4yH4EGWBtAtcG",
                                        "value": true,
                                        "metadata": {
                                            "module": "MOBILE_APP",
                                            "belongTo": "closeAllSessions",
                                            "showTitle": true,
                                            "positionTitle": "right"
                                        }
                                    },
                                    {
                                        "type": "toogle",
                                        "title": "Nicaragua",
                                        "keyId": "ni",
                                        "nodeName": "CAS-ni-tg_mtj5VK4pV4yH4EGWBtAtcG",
                                        "value": false,
                                        "metadata": {
                                            "module": "MOBILE_APP",
                                            "belongTo": "closeAllSessions",
                                            "showTitle": true,
                                            "positionTitle": "right"
                                        }
                                    },
                                    {
                                        "type": "toogle",
                                        "title": "Panamá",
                                        "keyId": "pa",
                                        "nodeName": "CAS-pa-tg_mtj5VK4pV4yH4EGWBtAtcG",
                                        "value": false,
                                        "metadata": {
                                            "module": "MOBILE_APP",
                                            "belongTo": "closeAllSessions",
                                            "showTitle": true,
                                            "positionTitle": "right"
                                        }
                                    },
                                    {
                                        "type": "toogle",
                                        "title": "Trinidad & Tobago",
                                        "keyId": "tt",
                                        "nodeName": "CAS-tt-tg_mtj5VK4pV4yH4EGWBtAtcG",
                                        "value": false,
                                        "metadata": {
                                            "module": "MOBILE_APP",
                                            "belongTo": "closeAllSessions",
                                            "showTitle": true,
                                            "positionTitle": "right"
                                        }
                                    },
                                    {
                                        "type": "toogle",
                                        "title": "Virgin Islands",
                                        "keyId": "vi",
                                        "nodeName": "CAS-vi-tg_mtj5VK4pV4yH4EGWBtAtcG",
                                        "value": false,
                                        "metadata": {
                                            "module": "MOBILE_APP",
                                            "belongTo": "closeAllSessions",
                                            "showTitle": true,
                                            "positionTitle": "right"
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "card",
                        "module": "MOBILE_APP",
                        "keyname": "landingPageMobile",
                        "hasFlatValue": true,
                        "title": "Landing Page",
                        "description": "*Sets the landing page to which the user will be redirected after authentication in the Mobile App.",
                        "components": [
                            {
                                "type": "container",
                                "style": {
                                    "layout": {
                                        "type": "row"
                                    }
                                },
                                "components": [
                                    {
                                        "type": "dropdown",
                                        "title": "Landing Page",
                                        "keyId": "",
                                        "nodeName": "LPM-dp_fS4y1444yUq5tNQen5eF6v",
                                        "options": [
                                            {
                                                "display": "Home",
                                                "value": {
                                                    "value_en": "/home",
                                                    "value_es": "/home"
                                                }
                                            },
                                            {
                                                "display": "My Account",
                                                "value": {
                                                    "value_en": "/my-account",
                                                    "value_es": "/mi-cuenta"
                                                }
                                            }
                                        ],
                                        "value": {
                                            "value_en": "/home",
                                            "value_es": "/home"
                                        },
                                        "metadata": {
                                            "module": "MOBILE_APP",
                                            "belongTo": "landingPageMobile"
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "card",
                        "module": "MOBILE_APP",
                        "keyname": "switchDisabledOnboarding",
                        "hasFlatValue": true,
                        "title": "Enable / Disable Onboarding Process",
                        "description": "*Enable or disable the onboarding process in the Mobile App. If true, the onboarding process is turned off.",
                        "components": [
                            {
                                "type": "container",
                                "style": {
                                    "layout": {
                                        "type": "grid",
                                        "columns": 2
                                    }
                                },
                                "components": [
                                    {
                                        "type": "toogle",
                                        "nodeName": "SDO-tg_qcK19wzPJoAtmJyx8Uu2Hs",
                                        "keyId": "",
                                        "title": "",
                                        "value": true,
                                        "metadata": {
                                            "module": "MOBILE_APP",
                                            "belongTo": "switchDisabledOnboarding"
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "card",
                        "module": "MOBILE_APP",
                        "keyname": "switchLoginEmail",
                        "hasFlatValue": true,
                        "title": "Enable / Disable Login with email",
                        "description": "*Enable or disable the option to log in to the Mobile App with your email. If true, the user can log in with an email.",
                        "components": [
                            {
                                "type": "container",
                                "style": {
                                    "layout": {
                                        "type": "grid",
                                        "columns": 2
                                    }
                                },
                                "components": [
                                    {
                                        "type": "toogle",
                                        "title": "",
                                        "keyId": "",
                                        "nodeName": "SLE-tg_qMp8kwnoHAHC7cy2ysGQSv",
                                        "value": false,
                                        "metadata": {
                                            "module": "MOBILE_APP",
                                            "belongTo": "switchLoginEmail"
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "card",
                        "module": "MOBILE_APP",
                        "keyname": "switchUniqueSession",
                        "hasFlatValue": true,
                        "title": "Enable / Disable Unique Session",
                        "description": "*Enable or disable the 'Unique Session' feature to allow only one active session per membership. If true, only one session is allowed on Mobile App.",
                        "components": [
                            {
                                "type": "container",
                                "style": {
                                    "layout": {
                                        "type": "grid",
                                        "columns": 2
                                    }
                                },
                                "components": [
                                    {
                                        "type": "toogle",
                                        "title": "",
                                        "keyId": "",
                                        "nodeName": "SUS-tg_w7LePx85fEpzZNYGV1BBZq",
                                        "value": true,
                                        "metadata": {
                                            "module": "MOBILE_APP",
                                            "belongTo": "switchUniqueSession"
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "card",
                        "module": "MOBILE_APP",
                        "keyname": "maintenanceScreen",
                        "hasFlatValue": true,
                        "title": "Maintenance screen",
                        "description": "*Shows up a screen to all users.",
                        "components": [
                            {
                                "type": "container",
                                "style": {
                                    "layout": {
                                        "type": "row"
                                    }
                                },
                                "components": [
                                    {
                                        "type": "toogle",
                                        "title": "Enable screen",
                                        "nodeName": "MS-tg1_tg_qcK19wzPJoAtmJyx8Uu2Hs",
                                        "value": false,
                                        "metadata": {
                                            "module": "MOBILE_APP",
                                            "belongTo": "maintenanceScreen"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "type": "container",
                "style": {
                    "layout": {
                        "type": "row"
                    }
                },
                "components": [
                    {
                        "type": "customCloseSessionByMembership",
                        "module": "MOBILE_APP",
                        "keyname": "closeSessionByMembership",
                        "title": "Close Session by Membership",
                        "description": "**Controls blacklisted memberships, allowing additions or removals through value edits.",
                        "components": []
                    }
                ]
            },
            {
                "type": "container",
                "style": {
                    "layout": {
                        "type": "row",
                        "columns": 2,
                        "justifyContent": "flex-end"
                    }
                },
                "components": [
                    {
                        "type": "button",
                        "title": "Apply changes later",
                        "nodeName": "applyChangesLater",
                        "onClick": "applyChangesLater",
                        "btnType": "outlined",
                        "metadata": {
                            "module": "MOBILE_APP",
                            "belongTo": ""
                        }
                    },
                    {
                        "type": "button",
                        "title": "Apply changes now",
                        "nodeName": "applyChangesNow",
                        "btnType": "solid",
                        "onClick": "applyChangesNow",
                        "metadata": {
                            "module": "MOBILE_APP",
                            "belongTo": ""
                        }
                    }
                ]
            }
        ]
    }
};
