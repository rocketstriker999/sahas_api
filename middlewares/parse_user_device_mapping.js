const logger = require("../libs/logger");

module.exports = async (req, res, next) => {
    if (req?.user) {
        //This user is not having any device mapping then allow to use device
        //New Device Mapping Added
        if (!(await hasUserAnyActiveDeviceMapping(req.user.id))) {
            await addActiveUserDeviceMapping(req.user.id, device.id);
        }

        //check if this device is assigned to this user
        device.isCurrentUserAssociatedWithDevice = await isDeviceAssignedToThisUser(device.id, req.user.id);

        //This User's Previous Mapping Was Found But Need To Add InActive Mapping
        if (!(await userDeviceMappingExist(req.user.id, req.device.id))) {
            await addInActiveUserDeviceMapping(req.user.id, req.device.id);
        }
    }

    next();
};
