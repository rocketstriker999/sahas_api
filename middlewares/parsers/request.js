const { getDeviceByFingerPrint } = require("../../db/devices");
const { readConfig } = require("../../libs/config");
const logger = require("../../libs/logger");

const DEVICE_FINGER_PRINT_KEY = "device-finger-print";

module.exports = async (req, res, next) => {
    //verify token and get user information
    if (req.headers?.token && (user = await getUserByToken(req.cookies.token))) {
        logger.info("YES1");
        req.user = user;
    }

    //verify device and get device information
    if (req.headers?.[DEVICE_FINGER_PRINT_KEY] && (device = await getDeviceByFingerPrint(req.headers?.[DEVICE_FINGER_PRINT_KEY]))) {
        logger.info("YES2");

        if (req?.user) {
            //This user is not having any device mapping then allow to use device
            //New Device Mapping Added
            if (!(await hasUserAnyActiveDeviceMapping(req.user.id))) {
                await addActiveUserDeviceMapping(req.user.id, device.id);
            }

            //check if this device is assigned to this user
            device.isCurrentUserAssociatedWithDevice = await isDeviceAssignedToThisUser(device.id, req.user.id);

            //This User's Previous Mapping Was Found But Need To Add InActive Mapping
            if (!(await userDeviceMappingExist(req.user.id, device.id))) {
                addInActiveUserDeviceMapping(req.user.id, device.id);
            }
        }

        req.device = device;
    }

    logger.info(
        `Incoming Request - ${req.method} ${req.url} | USER_ID : ${user?.id} - USER_EMAIL : ${user?.email} | Device FingerPrint : ${device?.finger_print} | Device Allowed : ${device?.isCurrentUserAssociatedWithDevice}`
    );

    next();
};
