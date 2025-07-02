const {
    getDeviceByFingerPrint,
    hasUserAnyActiveDeviceMapping,
    addActiveUserDeviceMapping,
    isDeviceAssignedToThisUser,
    userDeviceMappingExist,
    addInActiveUserDeviceMapping,
} = require("../../db/devices");
const logger = require("../../libs/logger");

const DEVICE_FINGER_PRINT_KEY = "device-finger-print";

module.exports = async (req, res, next) => {
    if (req.headers?.[DEVICE_FINGER_PRINT_KEY] && (device = await getDeviceByFingerPrint(req.headers?.[DEVICE_FINGER_PRINT_KEY]))) {
        if (req.user) {
            if (!(await hasUserAnyActiveDeviceMapping(req.user.id))) {
                await addActiveUserDeviceMapping(req.user.id, device.id);
                logger.info("Active Device Mapping Was Added For User");
            }

            device.isCurrentUserAssociatedWithDevice = await isDeviceAssignedToThisUser(device.id, req.user.id);

            if (!(await userDeviceMappingExist(req.user.id, device.id))) {
                addInActiveUserDeviceMapping(req.user.id, device.id);
                logger.info("Inactive Device Mapping Was Added For User");
            }
        }

        req.device = device;
    }
    next();
};
