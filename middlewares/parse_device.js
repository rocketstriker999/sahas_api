const { getDeviceByFingerPrint, hasDeviceAnyAssociatedUser, addDeviceUser, isDeviceAssignedToThisUser } = require("../db/devices");
const logger = require("../libs/logger");

const DEVICE_FINGER_PRINT_KEY = "device-finger-print";

module.exports = async (req, res, next) => {
    if (req.headers?.[DEVICE_FINGER_PRINT_KEY] && (device = await getDeviceByFingerPrint(req.headers?.[DEVICE_FINGER_PRINT_KEY]))) {
        if (req.user) {
            if (!(await hasDeviceAnyAssociatedUser(device.id))) {
                await addDeviceUser(req.user.id, device.id);
            }
            device.isCurrentUserAssociatedWithDevice = await isDeviceAssignedToThisUser(device.id, req.user.id);
        }

        req.device = device;
    }
    next();
};
