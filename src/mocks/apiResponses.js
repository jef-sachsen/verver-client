import config from "../config";

export const apiResponse_ErrorNoConnection = {
  code: 503,
  devMessage: "An error ocurred while trying to connect to the API.",
  error: config.ERROR.NOCONNECTION
};

export const apiResponse_user = {
  last: false,
  totalPages: 11,
  totalElements: 51,
  sort: null,
  numberOfElements: 5,
  first: true,
  size: 5,
  number: 0,
  content: [
    {
      id: 0,
      username: "user0",
      firstName: "Max",
      lastName: "Mustermann",
      email: "max.mustermann@mail.de",
      password: "string",
      phone: "string",
      userStatus: 0,
      groups: [
        {
          id: 0,
          name: "string",
          permissions: [
            {
              id: 0,
              name: "string"
            }
          ]
        }
      ]
    },
    {
      id: 1,
      username: "user1",
      firstName: "Max",
      lastName: "Mustermann",
      email: "max.mustermann@mail.de",
      password: "string",
      phone: "string",
      userStatus: 0,
      groups: [
        {
          id: 0,
          name: "string",
          permissions: [
            {
              id: 0,
              name: "string"
            }
          ]
        }
      ]
    }
  ]
};

export const apiResponse_role = {
  content: [
    {
      id: 0,
      name: "Test Role 1",
      description: "Description 1",
      permissions: [
        {
          id: 0,
          name: "Permission 1"
        },
        {
          id: 1,
          name: "Permission 2"
        }
      ]
    },
    {
      id: 1,
      name: "Test Role 2",
      description: "Description 2",
      permissions: [
        {
          id: 4,
          name: "Permission 5"
        },
        {
          id: 5,
          name: "Permission 6"
        }
      ]
    }
  ]
};

export const apiResponse_createRole = {
  content: [
    {
      id: 0,
      name: "Test Role 1",
      description: "Description 1",
      permissions: [
        {
          id: 0,
          name: "Permission 1"
        },
        {
          id: 1,
          name: "Permission 2"
        }
      ]
    }
  ]
};
