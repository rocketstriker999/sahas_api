const { getDeviceByFingerPrint, hasUserAnyActiveDeviceMapping, addActiveUserDeviceMapping, isDeviceAssignedToThisUser } = require("../db/devices");
const logger = require("../libs/logger");

const DEVICE_FINGER_PRINT_KEY = "device-finger-print";

module.exports = async (req, res, next) => {
    if (req.headers?.[DEVICE_FINGER_PRINT_KEY] && (device = await getDeviceByFingerPrint(req.headers?.[DEVICE_FINGER_PRINT_KEY]))) {
        if (req.user) {
            if (!(await hasUserAnyActiveDeviceMapping(req.user.id))) {
                //for this user no device allocation or mapping has happened then allow to use device
                //this will lead to two scenarios
                //1)User is new and device is also new  with no mapping - fine
                //2)User is new and maybe using someone's device  - 1 device 2 users
                await addActiveUserDeviceMapping(req.user.id, device.id);
            }

            device.isCurrentUserAssociatedWithDevice = await isDeviceAssignedToThisUser(device.id, req.user.id);
        }

        req.device = device;
    }
    next();
};
