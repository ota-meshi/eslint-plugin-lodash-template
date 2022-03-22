import LogRocket from "logrocket";
import createPlugin from "logrocket-vuex";

const LOGROCKET_ID = '<%= options.logRocketId %>';
const DEV_MODE_ALLOWED = <%= options.devModeAllowed %>;

export default function ({app, store}, inject) {

    // Variable for detecting production mode
    const isProduction = process.env.NODE_ENV === "production";

    /*
     * Only run on browser and when in production mode
     * or when the developer enables devModeAllowed
     */
    if (LOGROCKET_ID && (process.client && isProduction || DEV_MODE_ALLOWED)) {

        // Initialize LogRocket with the provided id
        LogRocket.init(LOGROCKET_ID);

    }
    // If nuxt app has a store initialized, load the logrocket-vuex plugin
    if (store) {

        const logrocketPlugin = createPlugin(LogRocket);
        // Add plugin to vuex store
        logrocketPlugin(store);

    }
    // Globally inject LogRocket instance
    inject(
        "logRocket",
        LogRocket
    );

}
