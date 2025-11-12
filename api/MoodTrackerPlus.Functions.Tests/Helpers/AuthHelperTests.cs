using System.Text;
using System.Text.Json;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Moq;
using MoodTrackerPlus.Functions.Helpers;

namespace MoodTrackerPlus.Functions.Tests.Helpers;

public class AuthHelperTests
{
    [Fact]
    public void GetUserId_ShouldReturnAnon_WhenNoAuthHeader()
    {
        // Arrange
        var mockRequest = new Mock<HttpRequestData>(MockBehavior.Strict, Mock.Of<FunctionContext>());
        mockRequest.Setup(r => r.Headers).Returns(new HttpHeadersCollection());

        // Act
        var userId = AuthHelper.GetUserId(mockRequest.Object);

        // Assert
        Assert.Equal("anon", userId);
    }

    [Fact]
    public void GetUserId_ShouldReturnUserId_WhenValidAuthHeader()
    {
        // Arrange
        var mockRequest = new Mock<HttpRequestData>(MockBehavior.Strict, Mock.Of<FunctionContext>());
        var headers = new HttpHeadersCollection();
        
        var principal = new
        {
            UserId = "test-user-123",
            UserRoles = "authenticated",
            IdentityProvider = "github"
        };
        
        var json = JsonSerializer.Serialize(principal);
        var encoded = Convert.ToBase64String(Encoding.UTF8.GetBytes(json));
        headers.Add("x-ms-client-principal", encoded);
        
        mockRequest.Setup(r => r.Headers).Returns(headers);

        // Act
        var userId = AuthHelper.GetUserId(mockRequest.Object);

        // Assert
        Assert.Equal("test-user-123", userId);
    }

    [Fact]
    public void GetUserId_ShouldReturnAnon_WhenInvalidAuthHeader()
    {
        // Arrange
        var mockRequest = new Mock<HttpRequestData>(MockBehavior.Strict, Mock.Of<FunctionContext>());
        var headers = new HttpHeadersCollection();
        headers.Add("x-ms-client-principal", "invalid-base64");
        
        mockRequest.Setup(r => r.Headers).Returns(headers);

        // Act
        var userId = AuthHelper.GetUserId(mockRequest.Object);

        // Assert
        Assert.Equal("anon", userId);
    }
}
