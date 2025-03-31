const updateImg = async (req, res) => {
    const { imageUrl } = req.body;
    try {
        const updatedUser = await UserSimple.findOneAndUpdate({_id: userId}, {userImg: imageUrl}, {new: true})
        if(!updatedUser) {
            return res.status(404).json('Not founded any doc')
        }
        return res.status(200).json('Update successfully')
    } catch (error) {
        console.log(error)
    }

};
