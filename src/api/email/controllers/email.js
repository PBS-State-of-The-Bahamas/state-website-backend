module.exports = {
  send: async (ctx) => {
    const EmailTypes = {
      CHAPTER_INTEREST: async (options) => {
        const chapter = await strapi.entityService.findMany(
          "api::chapter.chapter",
          {
            filters: { chapter_abbreviation: options.chapter },
          }
        );
        const emailObject = {
          to: chapter[0].email,
          templateID: process.env.SENDGRID_TEMPLATE_ID,
          data: {
            fullName: options.data.fullName,
            email: options.data.email,
            phone: options.data.phone,
            eligibilityQuestions: options.data.eligibilityQuestions,
          },
        };
        return emailObject;
      },
    };
    const options = ctx.request.body;

    try {
      const email = await EmailTypes[options.form](options);
      await strapi.plugin("email").service("email").send({
        to: email.to,
        template_id: email.templateID,
        dynamic_template_data: email.data,
      });
    } catch (e) {
      ctx.response.badRequest("Couldn't send email");
      throw new Error(`Couldn't send email: ${e.message}.`);
    }
    ctx.send({ success: true });
  },
};
