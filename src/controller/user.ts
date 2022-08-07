import { Request, Response } from "express";
import User from "../model/user";
import Cache from "../config/redis";

/* Profiles */
export const GetProfiles = async (request: Request, response: Response) => {
  const { idUser } = request.cookies;

  if (!idUser) {
    response.status(400).json({
      success: false,
      message: "id user not found in cookies",
    });
    return;
  }

  const user = await Cache.get("user-" + idUser);
  if (user) {
    const profiles = JSON.parse(user).profiles;
    if (profiles) {
      response.status(200).json({
        success: true,
        message: profiles,
      });
      return;
    }
  }

  try {
    await User.findById({ _id: idUser }).then(function (user) {
      if (user) {
        const profiles = user.getProfiles();
        response.status(200).json({
          success: true,
          message: profiles,
        });
        return;
      }

      response.status(400).json({
        success: false,
        message: "user not found",
      });
      return;
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error,
    });
    return;
  }
};

export const AddProfiles = async (request: Request, response: Response) => {
  const { idUser } = request.cookies;
  const { name } = request.body;

  if (!idUser) {
    response.status(400).json({
      success: false,
      message: "id user not found in cookies",
    });
    return;
  }

  if (!name) {
    response.status(400).json({
      success: false,
      message: "missing name value",
    });
    return;
  }

  try {
    await User.findById({ _id: idUser }).then(function (user) {
      if (user) {
        const result = user.addProfile(name);

        if (result === 1) {
          user.save();

          /* redis */
          // do

          response.status(200).json({
            success: true,
            message: "profile created successfully",
          });
          return;
        } else if (result === -1) {
          response.status(400).json({
            success: false,
            message: "limit of only 5 profiles",
          });
          return;
        }

        response.status(500).json({
          success: false,
          message: "error, profile was not created",
        });
        return;
      }

      response.status(400).json({
        success: false,
        message: "user not found",
      });
      return;
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error,
    });
    return;
  }
};

export const DelProfiles = async (request: Request, response: Response) => {
  const { idUser } = request.cookies;
  const { idProfile } = request.body;

  if (!idUser) {
    response.status(400).json({
      success: false,
      message: "id user not found in cookies",
    });
    return;
  }

  if (idProfile === undefined) {
    response.status(400).json({
      success: false,
      message: "missing idProfile value",
    });
    return;
  }

  try {
    await User.findById({ _id: idUser }).then(function (user) {
      if (user) {
        const result = user.delProfile(Number.parseInt(idProfile));

        if (result === 1) {
          user.save();

          /* redis */
          // do

          response.status(200).json({
            success: true,
            message: "profile deleted successfully",
          });
          return;
        } else if (result === -1) {
          response.status(400).json({
            success: false,
            message: "idProfile does not match expected",
          });
          return;
        } else if (result === -2) {
          response.status(400).json({
            success: false,
            message: "profile not found",
          });
          return;
        }

        response.status(500).json({
          success: false,
          message: "profile was not deleted",
        });
        return;
      }

      response.status(400).json({
        success: false,
        message: "user not found",
      });
      return;
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error,
    });
    return;
  }
};

export const UpdProfiles = async (request: Request, response: Response) => {
  const { idUser } = request.cookies;
  const { idProfile, name } = request.body;

  if (!idUser) {
    response.status(400).json({
      success: false,
      message: "id user not found in cookies",
    });
    return;
  }

  if (idProfile === undefined || !name) {
    response.status(400).json({
      success: false,
      message: "missing idProfile or name value",
    });
    return;
  }

  try {
    await User.findById({ _id: idUser }).then(function (user) {
      if (user) {
        const result = user.updProfile(Number.parseInt(idProfile), name);

        if (result === 1) {
          user.save();

          /* redis */
          // do

          response.status(200).json({
            success: true,
            message: "profile updated successfully",
          });
          return;
        } else if (result === -1) {
          response.status(400).json({
            success: false,
            message: "idProfile does not match expected",
          });
          return;
        } else if (result === -2) {
          response.status(400).json({
            success: false,
            message: "profile not found",
          });
          return;
        } else if (result === -3) {
          response.status(400).json({
            success: false,
            message: "profile name too long",
          });
          return;
        }

        response.status(500).json({
          success: false,
          message: "profile was not updated",
        });
        return;
      }

      response.status(400).json({
        success: false,
        message: "user not found",
      });
      return;
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error,
    });
    return;
  }
};

/* Wish */
export const GetWish = async (request: Request, response: Response) => {
  const { idUser, idProfile } = request.cookies;

  if (!idUser) {
    response.status(400).json({
      success: false,
      message: "id user not found in cookies",
    });
    return;
  }

  if (idProfile === undefined) {
    response.status(400).json({
      success: false,
      message: "missing idProfile value",
    });
    return;
  }

  try {
    await User.findById({ _id: idUser }).then(function (user) {
      if (user) {
        const result = user.getWish(Number.parseInt(idProfile));

        if (result) {
          response.status(200).json({
            success: true,
            message: result,
          });
          return;
        }

        response.status(200).json({
          success: false,
          message: "wish list not found",
        });
        return;
      }

      response.status(400).json({
        success: false,
        message: "user not found",
      });
      return;
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error,
    });
    return;
  }
};

export const AddWish = async (request: Request, response: Response) => {
  const { idUser, idProfile } = request.cookies;
  const { content } = request.body;

  if (!idUser) {
    response.status(400).json({
      success: false,
      message: "id user not found in cookies",
    });
    return;
  }

  if (idProfile === undefined) {
    response.status(400).json({
      success: false,
      message: "missing idProfile value",
    });
    return;
  }

  if (
    !content ||
    !content.id ||
    !content.title ||
    !content.original_language ||
    !content.original_title ||
    !content.overview ||
    !content.poster_path ||
    !content.media_type ||
    !content.genre_ids ||
    !content.release_date ||
    !content.vote_average
  ) {
    response.status(400).json({
      success: false,
      message: "missing some content value",
    });
    return;
  }

  try {
    await User.findById({ _id: idUser }).then(function (user) {
      if (user) {
        const result = user.addWish(Number.parseInt(idProfile), content);

        if (result === 1) {
          user.save();

          response.status(200).json({
            success: true,
            message: result,
          });
          return;
        } else if (result === -1) {
          response.status(400).json({
            success: false,
            message: "content already added",
          });
          return;
        }

        response.status(200).json({
          success: false,
          message: "content not added to wish list",
        });
        return;
      }

      response.status(400).json({
        success: false,
        message: "user not found",
      });
      return;
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error,
    });
    return;
  }
};

export const DelWish = async (request: Request, response: Response) => {
  const { idUser, idProfile } = request.cookies;
  const { idContent } = request.body;

  if (!idUser) {
    response.status(400).json({
      success: false,
      message: "id user not found in cookies",
    });
    return;
  }

  if (idProfile === undefined) {
    response.status(400).json({
      success: false,
      message: "missing idProfile value",
    });
    return;
  }

  if (idContent === undefined) {
    response.status(400).json({
      success: false,
      message: "missing idContent value",
    });
    return;
  }

  try {
    await User.findById({ _id: idUser }).then(function (user) {
      if (user) {
        const result = user.delWish(
          Number.parseInt(idProfile),
          Number.parseInt(idContent)
        );

        if (result === 1) {
          user.save();

          response.status(200).json({
            success: true,
            message: result,
          });
          return;
        } else if (result === -1) {
          response.status(400).json({
            success: false,
            message: "content not found",
          });
          return;
        }

        response.status(200).json({
          success: false,
          message: "content not deleted to wish list",
        });
        return;
      }

      response.status(400).json({
        success: false,
        message: "user not found",
      });
      return;
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error,
    });
    return;
  }
};

export const GetWishIds = async (request: Request, response: Response) => {
  const { idUser, idProfile } = request.cookies;

  if (!idUser) {
    response.status(400).json({
      success: false,
      message: "id user not found in cookies",
    });
    return;
  }

  if (idProfile === undefined) {
    response.status(400).json({
      success: false,
      message: "missing idProfile value",
    });
    return;
  }

  try {
    await User.findById({ _id: idUser }).then(function (user) {
      if (user) {
        const result = user.getWishIds(Number.parseInt(idProfile));

        if (result) {
          response.status(200).json({
            success: true,
            message: result,
          });
          return;
        }

        response.status(200).json({
          success: false,
          message: "wish list not found",
        });
        return;
      }

      response.status(400).json({
        success: false,
        message: "user not found",
      });
      return;
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error,
    });
    return;
  }
};

/* Watched */
export const GetWatched = async (request: Request, response: Response) => {
  const { idUser, idProfile } = request.cookies;

  if (!idUser) {
    response.status(400).json({
      success: false,
      message: "id user not found in cookies",
    });
    return;
  }

  if (idProfile === undefined) {
    response.status(400).json({
      success: false,
      message: "missing idProfile value",
    });
    return;
  }

  try {
    await User.findById({ _id: idUser }).then(function (user) {
      if (user) {
        const result = user.getWatched(Number.parseInt(idProfile));

        if (result) {
          response.status(200).json({
            success: true,
            message: result,
          });
          return;
        }

        response.status(200).json({
          success: false,
          message: "wish list not found",
        });
        return;
      }

      response.status(400).json({
        success: false,
        message: "user not found",
      });
      return;
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error,
    });
    return;
  }
};

export const AddWatched = async (request: Request, response: Response) => {
  const { idUser, idProfile } = request.cookies;
  const { content } = request.body;

  if (!idUser) {
    response.status(400).json({
      success: false,
      message: "id user not found in cookies",
    });
    return;
  }

  if (idProfile === undefined) {
    response.status(400).json({
      success: false,
      message: "missing idProfile value",
    });
    return;
  }

  if (
    !content ||
    !content.id ||
    !content.title ||
    !content.original_language ||
    !content.original_title ||
    !content.overview ||
    !content.poster_path ||
    !content.media_type ||
    !content.genre_ids ||
    !content.release_date ||
    !content.vote_average
  ) {
    response.status(400).json({
      success: false,
      message: "missing some content value",
    });
    return;
  }

  try {
    await User.findById({ _id: idUser }).then(function (user) {
      if (user) {
        const result = user.addWatched(Number.parseInt(idProfile), content);

        if (result === 1) {
          user.save();

          response.status(200).json({
            success: true,
            message: result,
          });
          return;
        } else if (result === -1) {
          response.status(400).json({
            success: false,
            message: "content already added",
          });
          return;
        }

        response.status(200).json({
          success: false,
          message: "content not added to wish list",
        });
        return;
      }

      response.status(400).json({
        success: false,
        message: "user not found",
      });
      return;
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      success: false,
      message: error,
    });
    return;
  }
};

export const DelWatched = async (request: Request, response: Response) => {
  const { idUser, idProfile } = request.cookies;
  const { idContent } = request.body;

  if (!idUser) {
    response.status(400).json({
      success: false,
      message: "id user not found in cookies",
    });
    return;
  }

  if (idProfile === undefined) {
    response.status(400).json({
      success: false,
      message: "missing idProfile value",
    });
    return;
  }

  if (idContent === undefined) {
    response.status(400).json({
      success: false,
      message: "missing idContent value",
    });
    return;
  }

  try {
    await User.findById({ _id: idUser }).then(function (user) {
      if (user) {
        const result = user.delWatched(
          Number.parseInt(idProfile),
          Number.parseInt(idContent)
        );

        if (result === 1) {
          user.save();

          response.status(200).json({
            success: true,
            message: result,
          });
          return;
        } else if (result === -1) {
          response.status(400).json({
            success: false,
            message: "content not found",
          });
          return;
        }

        response.status(200).json({
          success: false,
          message: "content not deleted to wish list",
        });
        return;
      }

      response.status(400).json({
        success: false,
        message: "user not found",
      });
      return;
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error,
    });
    return;
  }
};

export const GetWatchedIds = async (request: Request, response: Response) => {
  const { idUser, idProfile } = request.cookies;

  if (!idUser) {
    response.status(400).json({
      success: false,
      message: "id user not found in cookies",
    });
    return;
  }

  if (idProfile === undefined) {
    response.status(400).json({
      success: false,
      message: "missing idProfile value",
    });
    return;
  }

  try {
    await User.findById({ _id: idUser }).then(function (user) {
      if (user) {
        const result = user.getWishIds(Number.parseInt(idProfile));

        if (result) {
          response.status(200).json({
            success: true,
            message: result,
          });
          return;
        }

        response.status(200).json({
          success: false,
          message: "wish list not found",
        });
        return;
      }

      response.status(400).json({
        success: false,
        message: "user not found",
      });
      return;
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error,
    });
    return;
  }
};
