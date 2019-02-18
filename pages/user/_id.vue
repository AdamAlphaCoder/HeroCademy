<template>
  <div class="container mt-6">
    <div class="row">
      <div class="col-md-3 mb-4">
        <img src="~/assets/img/profile.jpg" alt="profile image" class="img-fluid">
      </div>
      <div class="col-md-9">
        <h3>Michael Jackson</h3>
        <b-button variant="primary">Follow</b-button>
        <b-button variant="outline">Message</b-button>
      </div>
    </div>
    <b-card class="mt-5" no-body>
      <b-tabs card>
        <b-tab title="Courses" active>
          <h3>TODO:</h3>
          <p>List all courses that are owned by this user</p>
          <p>
            Add following and message function (
            <strong>Disabled if this user is the one currently logged in / Not logged in</strong>)
          </p>
        </b-tab>
        <b-tab title="Accomplishments">User's Accomplishments</b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>
